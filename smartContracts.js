var fs = require('fs');

var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:20010'));

function submitContract(deployAccount, privateFor, cb){
  var tokenContractFilePath = __dirname + '/privateToken.sol';
  fs.readFile(tokenContractFilePath, 'utf8', function(err, source){
    if(err){console.log("ERROR:", err);}
    var compiled = web3.eth.compile.solidity(source);
    var contractRoot = Object.keys(compiled)[0];
    var data = compiled[contractRoot].code;
    var abi = compiled[contractRoot].info.abiDefinition;

    web3.eth.contract(abi)
    .new(100, {from: deployAccount, data: data, gas: 3000000, privateFor: privateFor}
    , function (err, contract) {
      if(err) {
        console.error("ERROR:", err);
        cb();
      } else if(contract.address){  
        console.log('Contract mined, address: ' + contract.address);
        cb({
          contractABI: abi,
          contractAddress: contract.address
        });
      }
    });
  });
}

function getContractInstance(contractABI, contractAddress){
  var contract_ = web3.eth.contract(contractABI);
  var instance = contract.at(contractAddress);
  return instance;
}

exports.SubmitContract = submitContract;
exports.GetContractInstance = getContractInstance;
