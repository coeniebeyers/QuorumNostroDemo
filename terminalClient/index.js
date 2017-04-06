var prompt = require('prompt');
prompt.start();

function displayAvailableForexContracts(cb){
  for(var i in forexContractList){
    var contract = forexContractList[i];
    var counterpartyNames = resolveCounterpartyNames(contract.counterparties);
    console.log(i+') '+new Date(contract.timestamp) + ' | '+ counterpartyNames);
  }
  cb();
}

function changeActiveForexContract(cb){
  console.log('Please select a contract to make active');
  displayAvailableForexContracts(function(){
    console.log('---');
    prompt.get(['contractNr'], function (err, o) {
      var selectedNr = Number(o.contractNr);
      if(selectedNr < forexContractList.length){
        activeForexContractNr = selectedNr;
      } else {
        console.log('Nr too high! Select a number below:', forexContractList.length);
      }
      cb();
    });
  });
}

function displayAvailableCurrencyContracts(cb){
  for(var i in currencyContractList){
    var contract = currencyContractList[i];
    var counterpartyNames = resolveCounterpartyNames(contract.counterparties);
    console.log(i+') '+new Date(contract.timestamp) + ' | '+ counterpartyNames);
  }
  cb();
}

function changeActiveCurrencyContract(cb){
  console.log('Please select a contract to make active');
  displayAvailableCurrencyContracts(function(){
    console.log('---');
    prompt.get(['contractNr'], function (err, o) {
      var selectedNr = Number(o.contractNr);
      if(selectedNr < currencyContractList.length){
        activeCurrencyContractNr = selectedNr;
      } else {
        console.log('Nr too high! Select a number below:', currencyContractList.length);
      }
      cb();
    });
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

function contractSubMenu(cb){
  console.log('1) Deploy currency contract');
  console.log('2) Deploy USDZAR contract');
  console.log('3) View address balance');
  console.log('4) Transfer amount to address');
  console.log('5) Change active Currency contract');
  console.log('6) Change active Forex contract');
  console.log('7) Request Nostro topup');
  console.log('0) Return to main menu');
  prompt.get(['option'], function (err, o) {
    if(o && o.option == 1){
      deployPrivateContract(function(){
        contractSubMenu(function(res){
          cb(res);
        });
      }); 
    } else if(o && o.option == 2){
      deployUSDZARContract(function(){
        contractSubMenu(function(res){
          cb(res);
        });
      }); 
    } else if(o && o.option == 3){
      var contractInstance = currencyContractList[activeCurrencyContractNr].contractInstance;
      balanceOf(contractInstance, function(res){
        console.log('Balance:', res);
        contractSubMenu(function(res){
          cb(res);
        });
      });      
    } else if(o && o.option == 4){
      var contractInstance = currencyContractList[activeCurrencyContractNr].contractInstance;
      var counterparties = currencyContractList[activeCurrencyContractNr].counterparties.slice();
      util.GetThisNodesConstellationPubKey(function(constellationKey){
        while(counterparties.indexOf(constellationKey) >= 0){
          counterparties.splice(counterparties.indexOf(constellationKey), 1);
        }
        transfer(contractInstance, counterparties, function(res){
          console.log('Tx hash:', res);
          contractSubMenu(function(res){
            cb(res);
          });
        });      
      });
    } else if(o && o.option == 5){
      changeActiveCurrencyContract(function(res){
        contractSubMenu(function(res){
          cb(res);
        });
      });      
    } else if(o && o.option == 6){
      changeActiveForexContract(function(res){
        contractSubMenu(function(res){
          cb(res);
        });
      });      
    } else if(o && o.option == 7){
      if(forexContractList.length > 0){
        requestNostroTopUp(function(res){
          contractSubMenu(function(res){
            cb(res);
          });
        });
      } else {
        console.log('\nERROR: First deploy the USDZAR contract\n');
        contractSubMenu(function(res){
          cb(res);
        });
      }
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

function menu(){
  console.log('1) Set node name');
  console.log('2) Display known constellation nodes');
  console.log('3) Contracts submenu');
  console.log('4) Address book submenu');
  console.log('0) Quit');
  prompt.get(['option'], function (err, o) {
    if(o.option == 1){
      setNodeName(function(){
        menu();
      });       
    } else if(o.option == 2){
      displayConstellationKeys(function(){
        console.log('-');
        menu();
      }); 
    } else if(o.option == 3){
      contractSubMenu(function(res){
        menu();
      });
    } else if(o.option == 4){
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

function addressBookSubMenu(cb){
  console.log('1) Create new account');
  console.log('2) Set account name');
  console.log('3) List accounts');
  console.log('4) List contacts in address book');
  console.log('0) Return to main menu');
  prompt.get(['option'], function (err, o) {
    if(o && o.option == 1){
      createNewAccount(function(){
        addressBookSubMenu(function(res){
          cb(res);
        });
      }); 
    } else if(o && o.option == 2){
      setAccountName(function(){
        addressBookSubMenu(function(res){
          cb(res);
        });
      }); 
    } else if(o && o.option == 3){
      listAccounts(function(){
        addressBookSubMenu(function(res){
          cb(res);
        });
      }); 
    } else if(o && o.option == 4){
      listAddressBookContacts(function(){
        addressBookSubMenu(function(res){
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

// TODO: add option to add a label/alias to an account
function listAccounts(cb){
  console.log('Account address                            | Account name');
  console.log('-------------------------------------------|----------------');
  for(var accountAddress in accountMapping){
    var accountName = accountMapping[accountAddress];
    console.log(accountAddress+' | '+accountName);
  }
  console.log('-------------------------------------------|----------------');
  cb();
}

function listAddressBookContacts(cb){
  console.log('Account address \t\t\t   | Constellation Key \t\t\t\t| Account name');
  console.log('-');
  for(var i in contactList){
    var contact = contactList[i];
    console.log(contact.address+' | '+contact.constellationKey+' | '+contact.name);
  }
  console.log('-');
  cb();
}

setTimeout(function(){
  menu();
}, 2000);
