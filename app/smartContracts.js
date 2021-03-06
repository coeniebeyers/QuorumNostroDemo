var fs = require('fs');

var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:20010'));

function submitPrivateCurrencyContract(deployAddress, currencyName, privateFor, cb){
  var tokenContractFilePath = __dirname + '/privateToken.sol';
  fs.readFile(tokenContractFilePath, 'utf8', function(err, source){
    if(err){console.log("ERROR:", err);}
    //web3.eth.defaultAccount = deployAddress;
    var compiled = web3.eth.compile.solidity(source);
    var contractRoot = Object.keys(compiled)[0];
    var data = compiled[contractRoot].code;
    var abi = compiled[contractRoot].info.abiDefinition;

    var gas = web3.eth.estimateGas({data: data});

    web3.eth.contract(abi)
    .new(1000000000, currencyName, 2, currencyName,  
    {from: deployAddress, data: data, gas: gas+300000, privateFor: privateFor}
    , function (err, contract) {
      if(err) {
        console.error("ERROR:", err);
        cb();
      } else if(contract.address){  
        console.log('Contract mined, address: ' + contract.address);
        cb({
          abi: abi,
          address: contract.address,
          code: data
        });
      }
    });
  });
}

function submitNostroContract(deployAddress, privateFor, cb){
  var contractFilePath = __dirname + '/usdZar.sol';
  fs.readFile(contractFilePath, 'utf8', function(err, source){
    if(err){console.log("ERROR:", err);}
    web3.eth.defaultAccount = deployAddress;
    var compiled = web3.eth.compile.solidity(source);
    var contractRoot = Object.keys(compiled)[0];
    var data = compiled[contractRoot].code;
    var abi = compiled[contractRoot].info.abiDefinition;

    var gas = web3.eth.estimateGas({data: data});

    web3.eth.contract(abi)
    .new(10, {from: deployAddress, data: data, gas: gas+30000, privateFor: privateFor}
    , function (err, contract) {
      if(err) {
        console.error("ERROR:", err);
        cb();
      } else if(contract.address){  
        console.log('Contract mined, address: ' + contract.address);
        cb({
          abi: abi,
          address: contract.address,
          code: data
        });
      }
    });
  });
}

function getContractInstance(contractABI, contractAddress){
  var contract = web3.eth.contract(contractABI);
  var instance = contract.at(contractAddress);
  return instance;
}

exports.SubmitPrivateCurrencyContract = submitPrivateCurrencyContract;
exports.GetContractInstance = getContractInstance;
exports.SubmitNostroContract = submitNostroContract;
