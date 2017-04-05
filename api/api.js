var express = require('express')
var app = express()

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// TODO: think about authentication, passing an account password (hash?) etc
app.get('/getNewAccountAddress', function(req, res) {
  var obj = {
    address: '0x12345'
  }
  res.send(JSON.stringify(obj));
});

let port = 4000;
app.listen(port, function () {
  console.log('Example app listening on port '+port+'!')
})
