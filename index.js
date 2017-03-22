var prompt = require('prompt');
var fs = require('fs');

var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:20010'));
// TODO: Add check that we are receiving valid from addresses
var myId = web3.shh.newIdentity();

var util = require('./util.js');
var contracts = require('./smartContracts.js');

var nodeIdentityName = 'unset';
var constellationNodes = {};
var nodeNames = {};
var deployedContract = null;

function startConstellationListeners(){
  web3.shh.filter({"topics":["Constellation"]}).watch(function(err, msg) {
    if(err){console.log("ERROR:", err);};
    var message = util.Hex2a(msg.payload);
    if(message.indexOf('request|publicKey') >= 0){
      getThisNodesConstellationPubKey(function(publicKey){
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

function getThisNodesConstellationPubKey(cb){
  fs.readFile('../QuorumNetworkManager/Constellation/node.pub', function read(err, data) {
    if (err) { console.log('ERROR:', err); }
    var publicKey = new Buffer(data).toString();
   cb(publicKey); 
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

function deployStorageContract(cb){
  console.log('Select whom to include in this contract.'); 
  console.log('Enter a number followed by enter, enter 0 once complete: \n'); 
  var selectedNumbers = [];
  displayConstellationKeys(function(){
    console.log('---');
    getNodesToShareWith(selectedNumbers, function(){
      resolveNumbersToNodes(selectedNumbers, function(nodes){
        var privateFor = [];  
        console.log('Nodes included in this contract is:');
        for(var i in nodes){
          var node = nodes[i];
          console.log(node.name);
          privateFor.push(node.constellationKey);
        }
        contracts.SubmitContract(web3.eth.accounts[0], privateFor, function(storageContract){ 
          console.log('Contract deployed!');
          cb(storageContract);
        });
      });
    });
  });
}

function constantSubMenu(cb){
  console.log('1) Deploy private contract');
  console.log('0) Return to main menu');
  prompt.get(['option'], function (err, o) {
    if(o.option == 1){
      deployStorageContract(function(storageContract){
        deployedContracts = storageContract;
        constantSubMenu(function(res){
          cb(res);
        });
      }); 
    } else if(o.option == 0){
      cb();
    } else {
      constantSubMenu(function(res){
        cb(res);
      });
    }
  });
}

prompt.start();
function menu(){
  console.log('1) Set node name');
  console.log('2) Get other node names');
  console.log('3) Request other nodes\' constellation keys');
  console.log('4) Display known constellation keys');
  console.log('5) Contracts submenu');
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
        console.log('---');
        menu();
      }); 
    } else if(o.option == 5){
      constantSubMenu(function(res){
        menu();
      });
    } else if(o.option == 0){
      console.log('Quiting');
      return;
    } else {
      menu();
    }
  });
}

startConstellationListeners();
startNodeNameListeners();
menu();
