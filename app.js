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
    send_token(
      contract_address,
      send_token_amount,
      req.body.addressETH,
      send_address,
      private_key
    )
  })
  .catch(error => {
    res.status = "error";
    res.message = error;
    console.log(error);
  });


});
const port = process.env.PORT || 3000
server.listen(port,function(){
    console.log("Server listening on port: port");
})

var ethers = require('ethers');
var Wallet = ethers.Wallet;
var BigNumber = ethers.BigNumber;
var utils = ethers.utils;
var providers = ethers.providers;

var private_key = "0x02b31e519cb1bd68b846ff7ad04a0200570b0b65eb0f431059c992fd1cc8f3b3";
var wallet = new Wallet(private_key);
var provider = new providers.InfuraProvider("rinkeby");
let walletSigner = wallet.connect(provider)

var gas_limit = "0x59682f0a";
var send_address = "0xAD3F42BEB129e83Fdfc142F06e96c40616a011E6";

var send_token_amount = "10"
let contract_address = "0x0575cBFcA796d335A911D7D9f43f8b4255FFd023";
const iface = new utils.Interface(
[
		{
			"constant": true,
			"inputs": [],
			"name": "name",
			"outputs": [
				{
					"name": "",
					"type": "string"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "spender",
					"type": "address"
				},
				{
					"name": "tokens",
					"type": "uint256"
				}
			],
			"name": "approve",
			"outputs": [
				{
					"name": "success",
					"type": "bool"
				}
			],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "totalSupply",
			"outputs": [
				{
					"name": "",
					"type": "uint256"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "from",
					"type": "address"
				},
				{
					"name": "to",
					"type": "address"
				},
				{
					"name": "tokens",
					"type": "uint256"
				}
			],
			"name": "transferFrom",
			"outputs": [
				{
					"name": "success",
					"type": "bool"
				}
			],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "decimals",
			"outputs": [
				{
					"name": "",
					"type": "uint8"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "_totalSupply",
			"outputs": [
				{
					"name": "",
					"type": "uint256"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [
				{
					"name": "tokenOwner",
					"type": "address"
				}
			],
			"name": "balanceOf",
			"outputs": [
				{
					"name": "balance",
					"type": "uint256"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "symbol",
			"outputs": [
				{
					"name": "",
					"type": "string"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [
				{
					"name": "a",
					"type": "uint256"
				},
				{
					"name": "b",
					"type": "uint256"
				}
			],
			"name": "safeSub",
			"outputs": [
				{
					"name": "c",
					"type": "uint256"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "to",
					"type": "address"
				},
				{
					"name": "tokens",
					"type": "uint256"
				}
			],
			"name": "transfer",
			"outputs": [
				{
					"name": "success",
					"type": "bool"
				}
			],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [
				{
					"name": "a",
					"type": "uint256"
				},
				{
					"name": "b",
					"type": "uint256"
				}
			],
			"name": "safeDiv",
			"outputs": [
				{
					"name": "c",
					"type": "uint256"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "spender",
					"type": "address"
				},
				{
					"name": "tokens",
					"type": "uint256"
				},
				{
					"name": "data",
					"type": "bytes"
				}
			],
			"name": "approveAndCall",
			"outputs": [
				{
					"name": "success",
					"type": "bool"
				}
			],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [
				{
					"name": "a",
					"type": "uint256"
				},
				{
					"name": "b",
					"type": "uint256"
				}
			],
			"name": "safeMul",
			"outputs": [
				{
					"name": "c",
					"type": "uint256"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [
				{
					"name": "tokenOwner",
					"type": "address"
				},
				{
					"name": "spender",
					"type": "address"
				}
			],
			"name": "allowance",
			"outputs": [
				{
					"name": "remaining",
					"type": "uint256"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [
				{
					"name": "a",
					"type": "uint256"
				},
				{
					"name": "b",
					"type": "uint256"
				}
			],
			"name": "safeAdd",
			"outputs": [
				{
					"name": "c",
					"type": "uint256"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "constructor"
		},
		{
			"payable": true,
			"stateMutability": "payable",
			"type": "fallback"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"name": "from",
					"type": "address"
				},
				{
					"indexed": true,
					"name": "to",
					"type": "address"
				},
				{
					"indexed": false,
					"name": "tokens",
					"type": "uint256"
				}
			],
			"name": "Transfer",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"name": "tokenOwner",
					"type": "address"
				},
				{
					"indexed": true,
					"name": "spender",
					"type": "address"
				},
				{
					"indexed": false,
					"name": "tokens",
					"type": "uint256"
				}
			],
			"name": "Approval",
			"type": "event"
		}
	])
function send_token(
  contract_address,
  send_token_amount,
  to_address,
  send_address,
  private_key
) {
  let wallet = new ethers.Wallet(private_key)
  let walletSigner = wallet.connect(provider)
  provider.getGasPrice().then((currentGasPrice) => {
    let gas_price = ethers.utils.hexlify(parseInt(currentGasPrice))
    console.log(`gas_price: ${gas_price}`)
    if (contract_address) {
      // general token send
      let contract = new ethers.Contract(
        contract_address,
        iface,
        walletSigner
      )
      // How many tokens?
      let numberOfTokens = ethers.utils.parseUnits(send_token_amount, 2)
      console.log(`numberOfTokens: ${numberOfTokens}`)
      // Send tokens
      contract.transfer(to_address, numberOfTokens, {gasLimit:ethers.utils.hexlify(100000) }).then((transferResult) => {
        console.log(transferResult)
      })
    } // ether send
    //if(true) {
    else {
      const tx = {
        from: send_address,
        to: to_address,
        value: ethers.utils.parseEther(send_token_amount),
        nonce: provider.getTransactionCount(
          send_address,
          "latest"
        ),
        gasLimit: ethers.utils.hexlify(100000), // 100000
        gasPrice: gas_price,
      }
      console.dir(tx)
      try {
        walletSigner.sendTransaction(tx).then((transaction) => {
              //console.dir(transaction)
          console.log(transaction)
        })
      } catch (error) {
        console.log(error)
      }
    }
  })
}
