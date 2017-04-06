var express = require('express')
var api = express()
var app = require('../app/index.js')

var bodyParser = require('body-parser')
api.use( bodyParser.json() );       // to support JSON-encoded bodies
api.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

api.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// TODO: think about authentication, passing an account password (hash?) etc
api.get('/getNewAccountAddress', function(req, res) {
  app.CreateNewAccount(function(account){
    var obj = {
      address: account.address
    }
    res.send(JSON.stringify(obj));
  });
});

api.get('/getNodes', function(req, res) {
  var nodeList = [{
    constellationAddress: 'kjsdbgsrgkbsjlfgn==',
    name: 'mock 1'
  }];
  res.send(JSON.stringify(nodeList));
});

let port = 4000;
api.listen(port, function () {
  console.log('api listening on port '+port+'!')
})
