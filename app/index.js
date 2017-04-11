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

var nodeIdentityName = 'FSR';
// TODO: rename object collections to mappings
var constellationNodes = {};
// TODO: rename object collections to mappings
var nodeNames = {};

var nostroAgreements = {};

function getBalancesPerNostroAgreement(address){
  var list = [];
  for(var i in nostroAgreements){
    var nostroAgreement = nostroAgreements[i]; 
    if(nostroAgreement.currency1Contract == null || nostroAgreement.currency2Contract == null){
      continue;
    }

    var balances = {};
    balances.nostroId = nostroAgreement.nostroContract.address;

    var currency1Contract = nostroAgreement.currency1Contract;
    var contract1 = contracts.GetContractInstance(currency1Contract.abi, currency1Contract.address);
    var currency1Balance = contract1.balanceOf(address).toString();
    balances.currency1Balance = currency1Balance; 
    balances.currency1Name = currency1Contract.name; 

    var currency2Contract = nostroAgreement.currency2Contract;
    var contract2 = contracts.GetContractInstance(currency2Contract.abi, currency2Contract.address);
    var currency2Balance = contract2.balanceOf(address).toString();
    balances.currency2Balance = currency2Balance; 
    balances.currency2Name = currency2Contract.name; 

    list.push(balances);
  }
  return list;
}

function getNostroBalances(){
  var list = [];
  var contactList = addressBook.ContactList;
  for(var i in contactList){
    var contact = contactList[i];
    var owner = resolveCounterpartyNames([contact.constellationKey])[0];
    var balances = getBalancesPerNostroAgreement(contact.address);
    if(balances.length == 0){
      continue;
    }
    var obj = {
      address: contact.address,
      name: contact.name,
      balances: balances,
      owner: owner
    }
    list.push(obj);
  }
  return list;
}

function getNodes(){
  var nodes = resolveCounterpartyNames(constellationNodes);
  return nodes; 
}

function getNostroAgreements(){
  var list = [];
  for(var i in nostroAgreements){
    var nostroAgreement = nostroAgreements[i];
    var counterparties1 = null;
    if(nostroAgreement.currency1Contract && nostroAgreement.currency1Contract.counterparties){
      counterparties1 = resolveCounterpartyNames(nostroAgreement.currency1Contract.counterparties);
    } else {
      continue;
    }
    var counterparties2 = null;
    if(nostroAgreement.currency2Contract && nostroAgreement.currency2Contract.counterparties){
      counterparties2 = resolveCounterpartyNames(nostroAgreement.currency2Contract.counterparties);
    } else {
      continue;
    }
    var currency1 = null;
    if(nostroAgreement.currency1Contract){
      currency1 = nostroAgreement.currency1Contract.name;
    } else {
      continue;
    }
    var currency2 = null;
    if(nostroAgreement.currency2Contract){
      currency2 = nostroAgreement.currency2Contract.name;
    } else {
      continue;
    }
    var obj = {
      currency1: currency1,
      counterpartiesToCurrency1: counterparties1,
      currency2: currency2,
      counterpartiesToCurrency2: counterparties2,
      id: nostroAgreement.nostroContract.address
    }
    list.push(obj); 
  }
  return list; 
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
      var constellationKey = messageArr[4]; 
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
          console.log('Deployed currency 2 contract!');
        });
      });
    } else if(message.indexOf('response|newNostroAgreement') >= 0 && msg.from != myId){
      var messageArr = message.split('|');
      var id = messageArr[2];
      var currency2Contract = JSON.parse(messageArr[3]);
      nostroAgreements[id].currency2Contract = currency2Contract; 
      console.log('Nostro agreement fulfilled:', id);
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

// TODO: this urrently only works for currency1 as the requester
function startNostroAccountManagementListeners(){
  web3.shh.filter({"topics":["NostroAccountManagement"]}).watch(function(err, msg) {
    if(err){console.log("ERROR:", err);};
    var message = util.Hex2a(msg.payload);
    if(message.indexOf('request|topup') >= 0 && msg.from != myId){

      //TODO: once this topup request comes through we should ask the other party what the rate is
      // For now we will simply set it as 10
      var rate = 10;

      var messageArr = message.split('|');
      var amount = Number(messageArr[2]); // Amount of currency2, USD
      var requesterAddress = messageArr[3]; // SA Bank address
      var nostroAgreementId = messageArr[4]; // Nostro Agreement Id

      var nostroAgreement = nostroAgreements[nostroAgreementId];
      var currency2Contract = nostroAgreement.currency2Contract;
      var currency2Instance = contracts.GetContractInstance(
                                currency2Contract.abi, 
                                currency2Contract.address
                              );
      var counterparties = currency2Contract.counterparties.slice();

      var nostroContract = nostroAgreement.nostroContract;
      var callData = currency2Instance.approve.getData(nostroContract.address, amount);
      var gas = web3.eth.estimateGas({data: callData});
      currency2Instance.approve(nostroContract.address, amount, 
        {from: web3.eth.accounts[0], gas: gas, privateFor: counterparties} 
        , function(err, txHash){

        if(err){console.log('ERROR:', err)}
        var nostroInstance = contracts.GetContractInstance(
                                nostroContract.abi, 
                                nostroContract.address
                             );
        callData = nostroInstance.addApproval.getData(
                     requesterAddress, 
                     currency2Contract.address, 
                     amount, 
                     rate
                   );
        gas = web3.eth.estimateGas({data: callData});
        nostroInstance.addApproval(requesterAddress, currency2Contract.address, amount, rate,
          {from: web3.eth.accounts[0], gas: gas, privateFor: counterparties} 
          , function(err, txHash){

          if(err){console.log('ERROR:', err)}
          // Respond with which vostro account should be credited 
          var message = 'response|topup';
          message = '|'+web3.eth.accounts[0];
          message = '|'+rate;
          var hexString = new Buffer(message).toString('hex');
          web3.shh.post({
            "topics": ["NostroAccountManagement"],
            "from": myId,
            "payload": hexString,
            "ttl": 10,
            "workToProve": 1
          }, function(err, res){
            if(err){console.log('err', err);}
          });
        });
      }); 
    } 
  });
}

function requestNostroTopUp(currency2Amount, nostroAgreementId, cb){
  var message = 'request|topup|'+currency2Amount;
  message += '|'+web3.eth.accounts[0]; // The account which to topup with token2, USD
  message += '|'+nostroAgreementId; // The id of which nostroAgreement to use
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
        var approverAddress = messageArr[2]; // US Bank's ZAR account
        var rate = Number(messageArr[3]); // The rate from the other party

        var nostroAgreement = nostroAgreements[nostroAgreementId];
        var currency1Contract = nostroAgreement.currency1Contract; 
        var currency1Instance = contracts.GetContractInstance(
                                  currency1Contract.abi, 
                                  currency1Contract.address
                                );

        var counterparties = currency1Contract.counterparties.slice();
        var currency1Amount = Math.round(currency2Amount*rate);
        var nostroContract = nostroAgreement.nostroContract;
        var callData = 
          currency1Instance.approveAndCall.getData(nostroContract.address, currency1Amount, '');
        var gas = web3.eth.estimateGas({data: callData});
        // We might need to wait a little bit to make sure the other party's transaction was mined
        setTimeout(function(){
          currency1Instance.approveAndCall(nostroContract.address, currency1Amount, ''
          , {from: web3.eth.accounts[0], gas: gas+3000000, privateFor: counterparties} 
          , function(err, txHash){
            if(err){console.log('ERROR:', err)}
            cb(txHash);
          });
        }, 0);
      }
    });
  });  
}

function start(){
  startConstellationListeners();
  startNodeNameListeners();
  newNostroAgreementListener();
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
exports.Start = start;
exports.GetNodes = getNodes;
exports.GetNostroAgreements = getNostroAgreements;
exports.GetNostroBalances = getNostroBalances;
exports.RequestNostroTopUp = requestNostroTopUp;

exports.CreateNewAccount = addressBook.CreateNewAccount;
