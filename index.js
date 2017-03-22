var prompt = require('prompt');
var fs = require('fs');

var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:20010'));
var myId = web3.shh.newIdentity();

var util = require('./util.js');

var constellationNodes = [];

function startWhisperListeners(){
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
      // TODO: add check that this is a new constellation node
      var publicKey = message.substring('response|publicKey|'.length+1)
      var constellationNode = {
        id: msg.from,
        publicKey: publicKey
      };
      constellationNodes.push(constellationNode); 
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
  console.log('Requesting constellation public keys:');
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
  for(var i in constellationNodes){
    var node = constellationNodes[i];
    console.log(node.publicKey + ' | ' + node.id);
  }
  cb();
}

prompt.start();
function menu(){
  console.log('1) Request other nodes\' constellation keys');
  console.log('2) Display known constellation keys');
  console.log('0) Quit');
  prompt.get(['option'], function (err, o) {
    if(o.option == 1){
      requestConstellationKeys(function(){
        menu();
      });
    } else if(o.option == 2){
      displayConstellationKeys(function(){
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

startWhisperListeners();
menu();
