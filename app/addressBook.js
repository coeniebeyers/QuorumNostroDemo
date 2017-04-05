var async = require('async');

var util = require('./util.js');

var unlockDuration = 999999;
var defaultPassword = '';
var defaultAccountName = 'unset';
var web3 = null;
var web3IPC = null;
var contactList = [];
var accountMapping = {};
var myId = null;

function setWeb3(_web3){
  web3 = _web3;
}

function setWeb3IPC(_web3IPC){
  web3IPC = _web3IPC;
}

function setWhisperId(whisperId){
  myId = whisperId;
}

// TODO: add check for where these messages are coming from
function startAddressBookListeners(){
  web3.shh.filter({"topics":["Addressbook"]}).watch(function(err, msg) {
    if(err){console.log("ERROR:", err);};
    var message = util.Hex2a(msg.payload);
    if(message.indexOf('request|contacts') >= 0){
      util.GetThisNodesConstellationPubKey(function(constellationKey){
        var obj = [];
        for(var account in accountMapping){
          obj.push({
            address: account,
            name: accountMapping[account],
            constellationKey: constellationKey
          });
        }
        var message = 'contacts|'+JSON.stringify(obj);
        var hexString = new Buffer(message).toString('hex');
        web3.shh.post({
          "topics": ["Addressbook"],
          "from": myId,
          "payload": hexString,
          "ttl": 10,
          "workToProve": 1
        }, function(err, res){
          if(err){console.log('err', err);}
        });
      });
    } else if(message.indexOf('contacts') >= 0){
      var messageArr = message.split('|');
      var contactObj = JSON.parse(messageArr[1]);
      for(var i in contactObj){
        var newContact = contactObj[i];
        var found = false;
        for(var j in contactList){
          var contact = contactList[j];
          if(contact && contact.address == newContact.address){
            found = true;
            contact.name = newContact.name;
            break; 
          }
        }
        if(found == false){
          contactList.push(newContact);
        } 
      }
    }
  });
}

function getAccountsFromOtherNodes(){
  var message = 'request|contacts';
  var hexString = new Buffer(message).toString('hex');
  web3.shh.post({
    "topics": ["Addressbook"],
    "from": myId,
    "payload": hexString,
    "ttl": 10,
    "workToProve": 1
  }, function(err, res){
    if(err){console.log('err', err);}
  });
}

function createNewAccount(cb){
  //prompt.get(['accountName'], function(err, o){
    web3IPC.personal.newAccount(defaultPassword, function(err, account){
      if(err){console.log('ERROR:', err)}
      accountMapping[account] = o.accountName;
      web3IPC.personal.unlockAccount(account, defaultPassword, unlockDuration, function(err, res){
        if(err){console.log('ERROR:', err)}
        cb({
          accountAddress: account,
          accountName: o.accountName
        });
      });
    });
  //});
}

// TODO: in the future this should load from a DB/textfile
function loadAllNodeAccounts(){
  for(var i in web3.eth.accounts){
    accountMapping[web3.eth.accounts[i]] = defaultAccountName; 
  }
}
function unlockAllAccounts(){
  console.log('[INFO] Unlocking all accounts ...');
  async.each(web3.eth.accounts, function(account, callback){
    web3IPC.personal.unlockAccount(account, defaultPassword, unlockDuration, function(err, res){
      callback(err, res);
    });
  }, function(err){
    if(err){
      console.log('ERROR:', err);
    } else {
      console.log('[INFO] All accounts unlocked');
    }
  }); 
}

exports.GetAccountsFromOtherNodes = getAccountsFromOtherNodes;
exports.StartListeners = startAddressBookListeners;
exports.SetWeb3 = setWeb3;
exports.SetWeb3IPC = setWeb3IPC;
exports.ContactList = contactList;
exports.AccountMapping = accountMapping;
exports.UnlockAllAccounts = unlockAllAccounts;
exports.LoadAllNodeAccounts = loadAllNodeAccounts;
exports.SetWhisperId = setWhisperId;
