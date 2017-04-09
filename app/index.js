var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:20010'));

var Web3IPC = require('web3_ipc');
var options = {
  host: '../../QuorumNetworkManager/Blockchain/geth.ipc',
  ipc: true,
  personal: true,
  admin: true,
  debug: false
};
var web3IPC = Web3IPC.create(options);

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

var nostroAgreements = {};

var currencyContractList = [];
var activeCurrencyContractNr = 0;

var forexContractList = [];
var activeForexContractNr = 0;


function getNodes(){
  var nodes = resolveCounterpartyNames(constellationNodes);
  return nodes; 
}

function getNostroAgreements(){
  return nostroAgreements; 
}

function deployCurrencyContract(deployAddress, currencyName, counterparties, cb){
  contracts.SubmitPrivateCurrencyContract(deployAddress, currencyName, counterparties
  , function(newContract){ 
    cb({
      abi: newContract.abi,
      address: newContract.address,
      counterparties: counterparties
    });
  });
}

function deployNostroContract(deployAddress, counterparties, cb){
  contracts.SubmitNostroContract(deployAddress, counterparties, function(newContract){ 
    cb({
      abi: newContract.abi,
      address: newContract.address,
      counterparties: counterparties
    });
  });
}

function deployNewNostroAgreement({currency1, currency2, counterparty} , cb){
  var constellationKey = getConstellationKeyFromName(counterparty);
  deployCurrencyContract(web3.eth.accounts[0], currency1, [constellationKey]
  , function(currency1Contract){
    currency1Contract.name = currency1;
    deployNostroContract(web3.eth.accounts[0], [constellationKey], function(nostroContract){ 

      nostroAgreements[nostroContract.address] = {
        currency1Contract: currency1Contract,
        currency2Contract: null,
        nostroContract: nostroContract
      };

      util.GetThisNodesConstellationPubKey(function(thisNodesConstellationKey){

        var message = 'request|newNostroAgreement|'+currency2;
        message += '|'+JSON.stringify(nostroAgreements[nostroContract.address]);
        message += '|'+thisNodesConstellationKey;
        var hexString = new Buffer(message).toString('hex');
        web3.shh.post({
          "topics": ["NewNostroAgreement"],
          "from": myId,
          "payload": hexString,
          "ttl": 10,
          "workToProve": 1
        }, function(err, res){
          cb(nostroAgreements[nostroContract.address]);
        });
      });
    });
  });
}

function newNostroAgreementListener(){
  web3.shh.filter({"topics":["NewNostroAgreement"]}).watch(function(err, msg) {
    if(err){console.log("ERROR:", err);};
    var message = util.Hex2a(msg.payload);
    if(message.indexOf('request|newNostroAgreement') >= 0 && msg.from != myId){
      var messageArr = message.split('|');
      var currency2 = messageArr[2];
      var newNostroAgreement = JSON.parse(messageArr[3]); 
      nostroAgreements[newNostroAgreement.nostroContract.address] = newNostroAgreement;
      var constellationKey = JSON.parse(messageArr[4]); 
      deployCurrencyContract(web3.eth.accounts[0], currency2, [constellationKey]
      , function(currency2Contract){
        currency2Contract.name = currency2;
        nostroAgreements[newNostroAgreement.nostroContract.address]
          .currency2Contract = currency2Contract;

        var message = 'response|newNostroAgreement';
        message += '|'+newNostroAgreement.nostroContract.address;
        message += '|'+JSON.stringify(currency2Contract);
        var hexString = new Buffer(message).toString('hex');
        web3.shh.post({
          "topics": ["NewNostroAgreement"],
          "from": myId,
          "payload": hexString,
          "ttl": 10,
          "workToProve": 1
        }, function(err, res){
        });
      });
    } else if(message.indexOf('response|newNostroAgreement') >= 0 && msg.from != myId){
      var messageArr = message.split('|');
      var id = messageArr[2];
      var currency2Contract = JSON.parse(messageArr[3]);
      nostroAgreements[id].currency2Contract = currency2Contract; 
    }
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
            counterpartyNames.push({
              name: nodeName,
              constellationAddress: constellationKey
            });
          }
        }
        break; 
      }
    } 
  }
  return counterpartyNames;
}

function getConstellationKeyFromName(counterpartyName){
  var found = false;
  for(var whisperId in nodeNames){
    var nodeName = nodeNames[whisperId];
    if(nodeName === counterpartyName){
      found = true;
      return constellationNodes[whisperId];
      break;
    }
  }
  if(found === false){
    return null;
  }
}

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
function startCurrencyContractListeners(){
  web3.shh.filter({"topics":["Currency"]}).watch(function(err, msg) {
    if(err){console.log("ERROR:", err);};
    var message = util.Hex2a(msg.payload);
    if(message.indexOf('info') >= 0){
      var messageArr = message.split('|');
      var contractObj = JSON.parse(messageArr[1]);
      var contractInstance = contracts.GetContractInstance(contractObj.abi, contractObj.address);
      var counterparties = JSON.parse(messageArr[2]);
      currencyContractList.push({
        timestamp: new Date(),
        contractInstance: contractInstance,
        counterparties: counterparties,
        address: contractObj.address,
        abi: contractObj.abi
      });
    }
  });
}

function startForexContractListeners(){
  web3.shh.filter({"topics":["Forex"]}).watch(function(err, msg) {
    if(err){console.log("ERROR:", err);};
    var message = util.Hex2a(msg.payload);
    if(message.indexOf('info') >= 0){
      var messageArr = message.split('|');
      var contractObj = JSON.parse(messageArr[1]);
      var contractInstance = contracts.GetContractInstance(contractObj.abi, contractObj.address);
      var counterparties = JSON.parse(messageArr[2]);
      forexContractList.push({
        timestamp: new Date(),
        contractInstance: contractInstance,
        counterparties: counterparties,
        address: contractObj.address,
        abi: contractObj.abi
      });
    }
  });
}

function requestConstellationKeys(){
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
  });
}

function requestNodeNames(){
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

function broadcastForexContractToCounterparties(counterparties, contract, cb){
  var payload = 'info';
  payload += '|'+JSON.stringify(contract);
  payload += '|'+JSON.stringify(counterparties);
  var hexPayload = new Buffer(payload).toString('hex');
  // TODO: there needs to be a 'to' field added so that other non-counterparty 
  //        nodes can't listen in
  web3.shh.post({
    "topics": ["Forex"],
    "from": myId,
    "payload": hexPayload,
    "ttl": 10,
    "workToProve": 1
  }, function(err, res){
    if(err){console.log('err', err);}
    cb();
  });
}

function broadcastCurrencyContractToCounterparties(counterparties, contract, cb){
  var payload = 'info';
  payload += '|'+JSON.stringify(contract);
  payload += '|'+JSON.stringify(counterparties);
  var hexPayload = new Buffer(payload).toString('hex');
  // TODO: there needs to be a 'to' field added so that other non-counterparty 
  //        nodes can't listen in
  web3.shh.post({
    "topics": ["Currency"],
    "from": myId,
    "payload": hexPayload,
    "ttl": 10,
    "workToProve": 1
  }, function(err, res){
    if(err){console.log('err', err);}
    cb();
  });
}

function startNostroAccountManagementListeners(){
  web3.shh.filter({"topics":["NostroAccountManagement"]}).watch(function(err, msg) {
    if(err){console.log("ERROR:", err);};
    var message = util.Hex2a(msg.payload);
    if(message.indexOf('request|topup') >= 0 && msg.from != myId){
      var messageArr = message.split('|');
      var amount = Number(messageArr[2]); // Amount of token2, USD
      var requesterAddress = messageArr[3]; // SA Bank address
      var tokenAddress = messageArr[4]; // token1, ZAR
      // Respond with which vostro account should be credited 
      var message = 'response|topup|'+web3.eth.accounts[0];
      var hexString = new Buffer(message).toString('hex');
      web3.shh.post({
        "topics": ["NostroAccountManagement"],
        "from": myId,
        "payload": hexString,
        "ttl": 10,
        "workToProve": 1
      }, function(err, res){
        if(err){console.log('err', err);}
        var contractInstance = currencyContractList[activeCurrencyContractNr].contractInstance;
        var counterparties = currencyContractList[activeCurrencyContractNr].counterparties.slice();
        util.GetThisNodesConstellationPubKey(function(constellationKey){
          while(counterparties.indexOf(constellationKey) >= 0){
            counterparties.splice(counterparties.indexOf(constellationKey), 1);
          }
          var activeForexContract = forexContractList[activeForexContractNr];
          var callData = contractInstance.approve.getData(activeForexContract.address, amount);
          var gas = web3.eth.estimateGas({data: callData});
          var activeContractAddress = currencyContractList[activeCurrencyContractNr].address;
          contractInstance.approve(activeForexContract.address, amount, 
            {from: web3.eth.accounts[0], gas: gas, privateFor: counterparties} 
            , function(err, txHash){
            if(err){console.log('ERROR:', err)}
            var usdzarContractInstance = contracts.GetContractInstance(
                                    activeForexContract.abi
                                  , activeForexContract.address);
            usdzarContractInstance.addApproval(requesterAddress, activeContractAddress, amount, 10,  
              {from: web3.eth.accounts[0], gas: gas, privateFor: counterparties} 
              , function(err, txHash){
              if(err){console.log('ERROR:', err)}
            });
          });
        });
      }); 
    } 
  });
}

function requestNostroTopUp(cb){
  var token2Amount = Number(o.amount); // token2, USD Amount
  var message = 'request|topup|'+token2Amount;
  message += '|'+web3.eth.accounts[0]; // The account which to topup with token2, USD
  message += '|'+currencyContractList[activeCurrencyContractNr].address; // Address of token1, ZAR
  var hexString = new Buffer(message).toString('hex');
  web3.shh.post({
    "topics": ["NostroAccountManagement"],
    "from": myId,
    "payload": hexString,
    "ttl": 10,
    "workToProve": 1
  }, function(err, res){
    if(err){console.log('err', err);}
    var filter = web3.shh.filter({"topics":["NostroAccountManagement"]}).watch(function(err, msg) {
      if(err){console.log("ERROR:", err);};
      var message = util.Hex2a(msg.payload);
      if(message.indexOf('response|topup') >= 0 && msg.from != myId){
        filter.stopWatching();
        var messageArr = message.split('|');
        // TODO: approverAddress doesn't seem to be used anywhere
        var approverAddress = messageArr[2]; // US Bank ZAR account
        //TODO: possible race condition if other party hasn't approved everything yet
        var contractInstance = currencyContractList[activeCurrencyContractNr].contractInstance;
        var counterparties = currencyContractList[activeCurrencyContractNr].counterparties.slice();
        util.GetThisNodesConstellationPubKey(function(constellationKey){
          while(counterparties.indexOf(constellationKey) >= 0){
            counterparties.splice(counterparties.indexOf(constellationKey), 1);
          }
          var token1Amount = Math.round(token2Amount*10);
          var activeForexContract = forexContractList[activeForexContractNr];
          var callData = 
            contractInstance.approveAndCall.getData(activeForexContract.address, token1Amount, '');
          var gas = web3.eth.estimateGas({data: callData});
          setTimeout(function(){
            contractInstance.approveAndCall(activeForexContract.address, token1Amount, ''
            , {from: web3.eth.accounts[0], gas: gas+3000000, privateFor: counterparties} 
            , function(err, txHash){
              if(err){console.log('ERROR:', err)}
              contractSubMenu(function(res){
                cb(res);
              });
            });
          }, 2000);
        });
      }
    });
  });  
}

function start(){
  startConstellationListeners();
  startNodeNameListeners();
  newNostroAgreementListener();
  startCurrencyContractListeners();
  startForexContractListeners();
  startNostroAccountManagementListeners();

  requestNodeNames();
  requestConstellationKeys();

  addressBook.UnlockAllAccounts();
  addressBook.LoadAllNodeAccounts();
  addressBook.StartListeners();
  addressBook.GetAccountsFromOtherNodes();

  setInterval(function(){
    addressBook.GetAccountsFromOtherNodes();
    requestNodeNames();
    requestConstellationKeys();
  }, 1*1000);
}

exports.DeployNewNostroAgreement = deployNewNostroAgreement;
exports.CreateNewAccount = addressBook.CreateNewAccount;
exports.Start = start;
exports.GetNodes = getNodes;
exports.GetNostroAgreements = getNostroAgreements;
