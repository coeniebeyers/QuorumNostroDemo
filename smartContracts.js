
function submitContract(deployAccount, privateFor, cb){
  var tokenContractFilePath = __dirname + '/privateToken.sol';
  fs.readFile(tokenContractFilePath, 'utf8', function(err, source){
    if(err){console.log("ERROR:", err);}
      var compiled = web3.eth.compile.solidity(source);
      var contractRoot = Object.keys(compiled)[0];

      var data = compiled[contractRoot].code;
      var abi = compiled[contractRoot].info.abiDefinition;

      web3.eth.contract(abi)
      .new(100, {from: accountAddress, data: data, gas: 300000, privateFor: privateFor}
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
