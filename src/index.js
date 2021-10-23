//(window as any).global = window;
// @ts-ignore
//window.Buffer = window.Buffer || require('buffer').Buffer;

import { FeeAmount, TickMath,nearestUsableTick,TICK_SPACINGS, encodeSqrtRatioX96 } from '@uniswap/v3-sdk'
//import { ChainId, Token } from "@uniswap/sdk";
//import { abi as QuoterABI } from "./public/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";
//ISwapRouter
import { CurrencyAmount, Token, TradeType, Percent} from "@uniswap/sdk-core";
//import { UniswapV3Factory } from "@uniswap/v3-core";
const { ChainId, Fetcher, DAI, USDC, WETH, Route, Trade, TokenAmount, SwapRouter, Pool } = require ("@uniswap/v3-sdk");
//import { Route } from "./v3-sdk/entites/route.d.ts";
//const swapRoute = new Route([poolExample], tokens["USDC"], tokens["BML"]);
//const poolAddress = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"
const routerAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564"
const poolAddress = "0x491bf019dbdf10404e27e0894b920ef893b63f68"
//import a  from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
var swapAbi  =require(  "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
//console.log(swapRoute)

//import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
//import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
//import { Route } from "./v3-sdk";
//import { abi as QuoterABI } from "./node_modules/@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);
var tokens = {"BML": "0x0575cBFcA796d335A911D7D9f43f8b4255FFd023", "USDC": "0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b"}
var precisions = {"BML": 100, "USDC":1000000}
function roundUp(num, precision=2) {
  precision = Math.pow(10, precision)
  return Math.ceil(num * precision) / precision
}

function getSigner() {
    return (new ethers.providers.Web3Provider(window.ethereum)).getSigner()
}

function balanceOf(address, tokenAddress="0x0575cBFcA796d335A911D7D9f43f8b4255FFd023"){
        var erc20_abi = [
          {
            "constant": true,
            "inputs": [
              {
                "name": "_owner",
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
            "type": "function"
          }
        ]
        const contract = new ethers.Contract(tokenAddress, erc20_abi, getSigner());
        return contract.balanceOf(address)
}

const routerABI = [{"inputs":[{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_WETH9","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"WETH9","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"bytes","name":"path","type":"bytes"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMinimum","type":"uint256"}],"internalType":"struct ISwapRouter.ExactInputParams","name":"params","type":"tuple"}],"name":"exactInput","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"tokenIn","type":"address"},{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"uint24","name":"fee","type":"uint24"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMinimum","type":"uint256"},{"internalType":"uint160","name":"sqrtPriceLimitX96","type":"uint160"}],"internalType":"struct ISwapRouter.ExactInputSingleParams","name":"params","type":"tuple"}],"name":"exactInputSingle","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"bytes","name":"path","type":"bytes"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMaximum","type":"uint256"}],"internalType":"struct ISwapRouter.ExactOutputParams","name":"params","type":"tuple"}],"name":"exactOutput","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"tokenIn","type":"address"},{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"uint24","name":"fee","type":"uint24"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMaximum","type":"uint256"},{"internalType":"uint160","name":"sqrtPriceLimitX96","type":"uint160"}],"internalType":"struct ISwapRouter.ExactOutputSingleParams","name":"params","type":"tuple"}],"name":"exactOutputSingle","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes[]","name":"data","type":"bytes[]"}],"name":"multicall","outputs":[{"internalType":"bytes[]","name":"results","type":"bytes[]"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"refundETH","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"selfPermit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"selfPermitAllowed","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"selfPermitAllowedIfNecessary","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"selfPermitIfNecessary","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountMinimum","type":"uint256"},{"internalType":"address","name":"recipient","type":"address"}],"name":"sweepToken","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountMinimum","type":"uint256"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"feeBips","type":"uint256"},{"internalType":"address","name":"feeRecipient","type":"address"}],"name":"sweepTokenWithFee","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"int256","name":"amount0Delta","type":"int256"},{"internalType":"int256","name":"amount1Delta","type":"int256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"uniswapV3SwapCallback","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountMinimum","type":"uint256"},{"internalType":"address","name":"recipient","type":"address"}],"name":"unwrapWETH9","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountMinimum","type":"uint256"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"feeBips","type":"uint256"},{"internalType":"address","name":"feeRecipient","type":"address"}],"name":"unwrapWETH9WithFee","outputs":[],"stateMutability":"payable","type":"function"},{"stateMutability":"payable","type":"receive"}]
function drawChart() {



var data = [['Coin', 'Balance']]
var totalValue = 0
var values = _.map(["BTC", "ETH", "BML", "USDC"], (symbol)=>{
  var price = window.prices[symbol]
  var value = Number($(`#balance${symbol}`).text() * price);
  window.value[symbol] = value;
  window.totalValue = totalValue
  totalValue += value;
  return [`${symbol}: $${roundUp(value)}`, value]
});
_.each(["BTC", "ETH", "BML", "USDC"], (symbol)=>{
  const percentage = window.value[symbol] / totalValue;
  window.percentages[symbol] = percentage;
  $(`#percent${symbol}`).val(roundUp(percentage * 100));
});

var data = google.visualization.arrayToDataTable(data.concat(values))

var options = {
  title: 'Investing\n            $' + roundUp(totalValue),
  titleTextStyle: {fontSize: 24},
  colors: [ '#ff8c00', 'grey', 'red','green'],
  legend:{position: 'top'}
};

var chart = new google.visualization.PieChart(document.getElementById('piechart'));

chart.draw(data, options);
}

$('#rebalanceButton').click( function(e) {
  e.preventDefault()
  if (!window.ethereum.selectedAddress){
    return
  }
console.log(Number($("#percentBML")[0].value) - window.percentages["BML"])
  const toBuy = (Number($("#percentBML")[0].value) - window.percentages["BML"]) * window.totalValue / 100;
//console.log(window.percentages["BML"])
//console.log($("#percentBML"))
//console.log(Number($("#percentBML")[0].value))
//console.log($("#percentBML").text())
console.log(toBuy)
  swap(toBuy)
});
$('#submitButton').click( function(e) {
  e.preventDefault()
  if (!window.ethereum.selectedAddress){
    return
  }

  var data = `addressETH=${window.ethereum.selectedAddress}&` + $('form#addressForm').serialize()

  $.post( '/add', data, function(balanceBTC) {
    window.balanceBTC = balanceBTC;
    $('#balanceBTC').text(balanceBTC/ 100000000);
    drawChart()
    $('#verifiedBTC').css("display","inline");
    $('#signatureForm').css("display","none");
       },
       'json'
    ,function(err){console.log(err)});
});

detectEthereumProvider().then(provider => {
if (provider) {
  window.provider = provider
  //swap()
  console.log(provider)
} else {
      console.log('Please install MetaMask!');
}
}).catch(error => {
  console.log(error)
})


let currentAccount = null;
window.ethereum
.request({ method: 'eth_accounts' })
.then(handleAccountsChanged)
.catch((err) => {
  console.error(err);
});
window.ethereum.on('accountsChanged', handleAccountsChanged);

function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    console.log('Please connect to MetaMask.');
  } else if (accounts[0] !== currentAccount) {
    currentAccount = accounts[0];
    $('#addressETH').text(currentAccount);
    window.ethereum
      .request({ method: 'eth_getBalance', params: [currentAccount, 'latest'] })
      .then((balance) => {
        const weiValue = parseInt(Number(balance), 10)
        const ethValue = weiValue/ 1000000000000000000
        const balanceETH = ethers.utils.parseEther(ethValue.toString());
        $('#balanceETH').text(roundUp(ethValue));
        $('#verifiedETH').css("display","inline");
        _.each(["BML", "USDC"], (symbol) => {
          balanceOf(currentAccount, tokens[symbol]).then((balance) => {
            $(`#balance${symbol}`).text(roundUp(balance/precisions[symbol]));
            drawChart()
          })
        })
        drawChart()
      })
      .catch((err) => {
        if (err.code === 4001) {
          console.log('Please connect to MetaMask.');
        } else {
          console.error(err);
        }
      });
    }
}

$('#connectButton').click(connect);

function connect() {
  window.ethereum
    .request({ method: 'eth_requestAccounts' })
    .then(handleAccountsChanged)
    .catch((err) => {
      if (err.code === 4001) {
        console.log('Please connect to MetaMask.');
      } else {
        console.error(err);
      }
    });
}
setInterval(
  function(){
    balanceOf(window.ethereum.selectedAddress).then((balance) => {
      if( balance /100 != $('#balanceBML').text()){
        alert("You have received 10 BML!")
        $('#balanceBML').text(balance/100);
        drawChart()
      }
    })
  }
  , 3000);

window.prices = {"BML":20, "BTC": 62000, "ETH": 3000, "USDC" : 1}
window.value = {"BML":0, "BTC": 0, "ETH": 0, "USDC" : 0}
window.percentages = {"BML":0, "BTC": 0, "ETH": 100, "USDC" : 0}
_.each(["BTC", "ETH", "USDC"], (symbol)=>{
  $.get(`https://api.binance.com/api/v3/avgPrice?symbol=${symbol}BUSD`, (data) => {
    window.prices[symbol] = data.price
    drawChart()
})

})


async function swap(usdcToBuy){
//const Web3 = require('web3');
//const routerABI = require('./abis/v3SwapRouterABI.json');
//const credentials = require('./credentials.json');

//const web3 = new Web3(`https://kovan.infura.io/v3/${credentials.infuraKey}`);
//const privateKey = credentials.privateKey;
//const activeAccount = window.ethereum.selectedAddress
const activeAccount = "0x450A0cCFC21e42467040ad6d29B6E8a97B7ec68B"

const routerAddress = `0xE592427A0AEce92De3Edee1F18E0157C05861564`; // Kovan Swap Router
const fromTokenAddress = tokens["USDC"]; // Kovan WETH
const toTokenAddress =tokens["BML"]; // Kovan DAI
const routerContract = new ethers.Contract(routerAddress, routerABI, getSigner());
const expiryDate = Math.floor(Date.now() / 1000) + 9000;

(async () => {
console.log((roundUp(usdcToBuy)).toString())
	const qty = ethers.utils.parseUnits((roundUp(usdcToBuy)).toString(), 6);
	console.log('qty',qty);
  const params = {
    tokenIn: fromTokenAddress,
    tokenOut: toTokenAddress,
    fee: 500,
    recipient: activeAccount,
    deadline: expiryDate,
    amountIn: qty,
    amountOutMinimum: 0,
    sqrtPriceLimitX96: 0,
  };

  let gas_price = ethers.utils.hexlify(parseInt(2389890000))
	let transactionObject = {
    gasLimit: ethers.utils.hexlify(10000000), // 100000
    //gasPrice: gas_price,
		//data: encoded_tx,
		//from: activeAccount,
		//to: routerAddress
	};
  routerContract.exactInputSingle(params, transactionObject).then((data)=>{console.log(data)});
  //console.log(tx_builder)
	//let encoded_tx = tx_builder.encodeABI();

	//web3.eth.accounts.signTransaction(transactionObject, activeAccount.privateKey, (error, signedTx) => {
		//if (error) {
			//console.log(error);
		//} else {
			//web3.eth.sendSignedTransaction(signedTx.rawTransaction).on('receipt', (receipt) => {
				//console.log(receipt);
			//});
		//}
	//});
	
})();
}
