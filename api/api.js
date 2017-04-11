var express = require('express')
var api = express()
var app = require('../app/index.js')
app.Start()

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
  var nodeList = app.GetNodes();
  res.send(JSON.stringify(nodeList));
});

api.get('/deployNewNostroAgreement', function(req, res) {
  var details = JSON.parse(req.query.details);
  app.DeployNewNostroAgreement(details, function(nostroAgreement){
    var nostroAgreements = app.GetNostroAgreements();
    res.send(JSON.stringify(nostroAgreements));
  }); 
});

api.get('/requestNostroTopUp', function(req, res) {
  var details = JSON.parse(req.query.details);
  var currency2Amount = Number(details.currency2Amount);
  var nostroAgreementId = details.nostroAgreementId;
  app.RequestNostroTopUp(currency2Amount, nostroAgreementId, function(txHash){
    res.send(txHash);
  }); 
});

api.get('/getNostroAgreements', function(req, res) {
  var nostroAgreements = app.GetNostroAgreements();
  res.send(JSON.stringify(nostroAgreements));
});

api.get('/getNostroBalances', function(req, res) {
  var balances = app.GetNostroBalances();
  res.send(balances);
});

let port = 4000;
api.listen(port, function () {
  console.log('api listening on port '+port+'!')
})
