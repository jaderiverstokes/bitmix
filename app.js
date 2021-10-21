var bodyParser = require('body-parser');
var bitcoin = require('bitcoinjs-lib') // v4.x.x
//var detectEthereumProvider = require('@metamask/detect-provider');
var axios = require('axios')
var bitcoinMessage = require('bitcoinjs-message')
var express = require('express');
var http = require('http');
var path = require("path");

var app = express();
var server = http.createServer(app);
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'.')));
app.get('/', function(req,res){
  res.sendFile(path.join(__dirname,'./public/index.html'));
});

app.post('/add', function(req,res){
  var signatureValid = bitcoinMessage.verify('420', req.body.addressBTC, req.body.signature, null, true);
  var addressBalanceEndpoint = `https://blockchain.info/address/${req.body.addressBTC}?format=json`;
  axios.get(addressBalanceEndpoint)
  .then(balance_response => {
    res.status = "success"
    res.final_balance = balance_response.data.final_balance;
    res.end(JSON.stringify(res.final_balance));
  })
  .catch(error => {
    res.status = "error";
    res.message = error;
    console.log(error);
  });


});
server.listen(3000,function(){
    console.log("Server listening on port: 3000");
})


