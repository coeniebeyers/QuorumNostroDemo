var prompt = require('prompt');

var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:20010'));

var Web3IPC = require('web3_ipc');
var options = {
  host: '../QuorumNetworkManager/Blockchain/geth.ipc',
  ipc: true,
  personal: true,
  admin: true,
  debug: false
};
var web3IPC = Web3IPC.create(options);

// TODO: Add check that we are receiving valid from addresses
var myId = web3.shh.newIdentity();

var util = require('./util.js');
var contracts = require('./smartContracts.js');
var addressBook = require('./addressBook.js');
addressBook.SetWeb3(web3);
addressBook.SetWeb3IPC(web3IPC);
addressBook.SetWhisperId(myId);

var nodeIdentityName = 'unset';
// TODO: rename object collections to mappings
var constellationNodes = {};
// TODO: rename object collections to mappings
var nodeNames = {};
var contractList = [];
var activeContractNr = 0;

prompt.start();

function startConstellationListeners(){
  web3.shh.filter({"topics":["Constellation"]}).watch(function(err, msg) {
    if(err){console.log("ERROR:", err);};
    var message = util.Hex2a(msg.payload);
    if(message.indexOf('request|publicKey') >= 0){
      util.GetThisNodesConstellationPubKey(function(publicKey){
        var message = 'response|publicKey|'+publicKey;
        var hexString = new Buffer(message).toString('hex');
        web3.shh.post({
          "topics": ["Constellation"],
          "from": myId,
          "payload": hexString,
          "ttl": 10,
          "workToProve": 1
        }, function(err, res){
          if(err){console.log('err', err);}
        });
      });
    } else if(message.indexOf('response|publicKey') >= 0){
      var publicKey = message.substring('response|publicKey|'.length+1)
      constellationNodes[msg.from] = publicKey;
    }
  });
}

function startNodeNameListeners(){
  web3.shh.filter({"topics":["NodeName"]}).watch(function(err, msg) {
    if(err){console.log("ERROR:", err);};
    var message = util.Hex2a(msg.payload);
    if(message.indexOf('request|nodeName') >= 0){
      var response = 'response|nodeName|'+nodeIdentityName;
      var hexString = new Buffer(response).toString('hex');
      web3.shh.post({
        "topics": ["NodeName"],
        "from": myId,
        "payload": hexString,
        "ttl": 10,
        "workToProve": 1
      }, function(err, res){
        if(err){console.log('err', err);}
      });
    } else if(message.indexOf('response|nodeName') >= 0){
      // TODO: add check that this is a new node name
      var nodeName = message.substring('response|nodeName|'.length+1);
      nodeNames[msg.from] = nodeName;
    }
  });
}

// TODO: add token to message giving the contract a name
function startCounterpartyListeners(){
  web3.shh.filter({"topics":["Counterparty"]}).watch(function(err, msg) {
    if(err){console.log("ERROR:", err);};
    var message = util.Hex2a(msg.payload);
    if(message.indexOf('info') >= 0){
      var messageArr = message.split('|');
      var contractObj = JSON.parse(messageArr[1]);
      var contractInstance = contracts.GetContractInstance(contractObj.abi, contractObj.address);
      var counterparties = JSON.parse(messageArr[2]);
      contractList.push({
        timestamp: new Date(),
        contractInstance: contractInstance,
        counterparties: counterparties
      });
    }
  });
}


function requestConstellationKeys(cb){
  var message = 'request|publicKey';
  var hexString = new Buffer(message).toString('hex');
  web3.shh.post({
    "topics": ["Constellation"],
    "from": myId,
    "payload": hexString,
    "ttl": 10,
    "workToProve": 1
  }, function(err, res){
    if(err){console.log('err', err);}
    cb();
  });
}

function displayConstellationKeys(cb){
  var i = 1;
  for(var id in constellationNodes){
    var constellationKey = constellationNodes[id];
    var name = nodeNames[id];
    console.log(i+') '+name +' | '+ constellationKey);
    i++;
  }
  cb();
}

function setNodeName(cb){
  prompt.get(['name'], function(err, node){
    nodeIdentityName = node.name;
    cb();
  });
}

function requestNodeNames(cb){
  var message = 'request|nodeName';
  var hexString = new Buffer(message).toString('hex');
  web3.shh.post({
    "topics": ["NodeName"],
    "from": myId,
    "payload": hexString,
    "ttl": 10,
    "workToProve": 1
  }, function(err, res){
    if(err){console.log('err', err);}
    cb();
  });
}

function getNodesToShareWith(selectedNumbers, cb){
  prompt.get(['number'], function(err, p){
    if(p.number == 0){
      cb();
    } else {
      selectedNumbers.push(p.number);
      getNodesToShareWith(selectedNumbers, function(res){
        cb(res);
      });
    }
  });
}

function resolveNumbersToNodes(selectedNumbers, cb){
  var selectedNodes = [];
  var i = 1;
  for(var id in constellationNodes){
    for(var j in selectedNumbers){
      var nr = Number(selectedNumbers[j]);
      if(nr == i) {
        var constellationKey = constellationNodes[id];
        var name = nodeNames[id];
        selectedNodes.push({
          constellationKey: constellationKey,
          name: name
        }); 
      }
    }
    i++;
  }
  cb(selectedNodes);
}

function broadcastContractToCounterparties(counterparties, contract, cb){
  var payload = 'info';
  payload += '|'+JSON.stringify(contract);
  payload += '|'+JSON.stringify(counterparties);
  var hexPayload = new Buffer(payload).toString('hex');
  // TODO: there needs to be a 'to' field added so that other non-counterparty 
  //        nodes can't listen in
  web3.shh.post({
    "topics": ["Counterparty"],
    "from": myId,
    "payload": hexPayload,
    "ttl": 10,
    "workToProve": 1
  }, function(err, res){
    if(err){console.log('err', err);}
    cb();
  });
}

// TODO: housekeeping!!!
function deployStorageContract(cb){
  console.log('Select whom to include in this contract.'); 
  console.log('Enter a number followed by enter. Select done when complete\n'); 
  var selectedNumbers = [];
  displayConstellationKeys(function(){
    console.log('0) Done');
    console.log('---');
    getNodesToShareWith(selectedNumbers, function(){
      resolveNumbersToNodes(selectedNumbers, function(nodes){
        var counterparties = [];  
        console.log('Nodes included in this contract is:');
        for(var i in nodes){
          var node = nodes[i];
          console.log(node.name);
          counterparties.push(node.constellationKey);
        }
        contracts.SubmitContract(web3.eth.accounts[0], counterparties, function(newContract){ 
          var contractInstance = contracts.GetContractInstance(
                                  newContract.abi
                                , newContract.address);

          util.GetThisNodesConstellationPubKey(function(constellationKey){
            counterparties.push(constellationKey);
            broadcastContractToCounterparties(counterparties, newContract, function(){
              cb();
            });
          });
        });
      });
    });
  });
}

function balanceOf(contractInstance, cb){
  prompt.get(['address'], function (err, o) {
    contractInstance.balanceOf(o.address, function(err, balance){
      if(err){console.log('ERROR:', err)}
      cb(balance.toString());
    });
  });
}

function transfer(contractInstance, counterparties, cb){
  web3.eth.defaultAccount = web3.eth.accounts[0];
  prompt.get(['toAddress', 'amount'], function (err, o) {
    var callData = contractInstance.transfer.getData(o.toAddress, Number(o.amount));
    var gas = web3.eth.estimateGas({data: callData});
    contractInstance.transfer(o.toAddress, Number(o.amount), {from: web3.eth.accounts[0], gas: gas, privateFor: counterparties} 
    , function(err, txHash){
      if(err){console.log('ERROR:', err)}
      cb(txHash);
    });
  });
}

// TODO: this can be cleaned up but shouldn't be a problem until we hit many nodes/counterparties
function resolveCounterpartyNames(counterparties){
  var counterpartyNames = [];
  for(var i in counterparties){
    var constellationKey = counterparties[i];
    for(var j in constellationNodes){
      var constellationNode = constellationNodes[j];
      if(constellationNode == constellationKey){ // We've found the associated whisper identity
        for(var k in nodeNames){
          var nodeName = nodeNames[k];
          if(j == k){ // We've found the nodeName we are looking for
            counterpartyNames.push(nodeName);
          }
        }
        break; 
      }
    } 
  }
  return counterpartyNames;
}

function displayAvailableContracts(cb){
  for(var i in contractList){
    var contract = contractList[i];
    var counterpartyNames = resolveCounterpartyNames(contract.counterparties);
    console.log(i+') '+new Date(contract.timestamp) + ' | '+ counterpartyNames);
  }
  cb();
}

function changeActiveContract(cb){
  console.log('Please select a contract to make active');
  displayAvailableContracts(function(){
    console.log('---');
    prompt.get(['contractNr'], function (err, o) {
      var selectedNr = Number(o.contractNr);
      if(selectedNr < contractList.length){
        activeContractNr = selectedNr;
      } else {
        console.log('Nr too high! Select a number below:', contractList.length);
      }
      cb();
    });
  });
}

function contractSubMenu(cb){
  console.log('1) Deploy private contract');
  console.log('2) View address balance');
  console.log('3) Transfer amount to address');
  console.log('4) Change active contract');
  console.log('0) Return to main menu');
  prompt.get(['option'], function (err, o) {
    if(o && o.option == 1){
      deployStorageContract(function(){
        contractSubMenu(function(res){
          cb(res);
        });
      }); 
    } else if(o && o.option == 2){
      var contractInstance = contractList[activeContractNr].contractInstance;
      balanceOf(contractInstance, function(res){
        console.log('Balance:', res);
        contractSubMenu(function(res){
          cb(res);
        });
      });      
    } else if(o && o.option == 3){
      var contractInstance = contractList[activeContractNr].contractInstance;
      var counterparties = contractList[activeContractNr].counterparties;
      console.log('counterparties:', counterparties);
      util.GetThisNodesConstellationPubKey(function(constellationKey){
        while(counterparties.indexOf(constellationKey) >= 0){
          counterparties.splice(counterparties.indexOf(constellationKey), 1);
        }
        console.log('counterparties:', counterparties);
        transfer(contractInstance, counterparties, function(res){
          console.log('Tx hash:', res);
          contractSubMenu(function(res){
            cb(res);
          });
        });      
      });
    } else if(o && o.option == 4){
      changeActiveContract(function(res){
        contractSubMenu(function(res){
          cb(res);
        });
      });      
    } else if(o && o.option == 0){
      cb();
      return;
    } else {
      contractSubMenu(function(res){
        cb(res);
      });
    }
  });
}

// TODO: only display this menu once the accounts have been unlocked
function menu(){
  console.log('1) Set node name');
  console.log('2) Get other node names');
  console.log('3) Request other nodes\' constellation keys');
  console.log('4) Display known constellation keys');
  console.log('5) Contracts submenu');
  console.log('6) Address book submenu');
  console.log('0) Quit');
  prompt.get(['option'], function (err, o) {
    if(o.option == 1){
      setNodeName(function(){
        menu();
      });       
    } else if(o.option == 2){
      requestNodeNames(function(){
        menu();
      });
    } else if(o.option == 3){
      requestConstellationKeys(function(){
        menu();
      });
    } else if(o.option == 4){
      displayConstellationKeys(function(){
        console.log('-');
        menu();
      }); 
    } else if(o.option == 5){
      contractSubMenu(function(res){
        menu();
      });
    } else if(o.option == 6){
      addressBook.SubMenu(function(res){
        menu();
      });
    } else if(o.option == 0){
      console.log('Quiting');
      process.exit(0);
      return;
    } else {
      menu();
    }
  });
}

startConstellationListeners();
startNodeNameListeners();
startCounterpartyListeners();

addressBook.UnlockAllAccounts();
addressBook.LoadAllNodeAccounts();
addressBook.StartListeners();
addressBook.GetAccountsFromOtherNodes();

setInterval(function(){
  addressBook.GetAccountsFromOtherNodes();
}, 5*1000);

setTimeout(function(){
  menu();
}, 2000);
