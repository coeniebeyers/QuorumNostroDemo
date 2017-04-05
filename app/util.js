var fs = require('fs');

function hex2a(hexx) {
  var hex = hexx.toString();//force conversion
  var str = '';
  for (var i = 0; i < hex.length; i += 2){
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
}

function getThisNodesConstellationPubKey(cb){
  fs.readFile('../../QuorumNetworkManager/Constellation/node.pub', function read(err, data) {
    if (err) { console.log('ERROR:', err); }
    var publicKey = new Buffer(data).toString();
    cb(publicKey); 
  });
}

exports.Hex2a = hex2a;
exports.GetThisNodesConstellationPubKey = getThisNodesConstellationPubKey;
