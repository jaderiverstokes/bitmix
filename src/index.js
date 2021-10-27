import { FeeAmount, TickMath,nearestUsableTick,TICK_SPACINGS, encodeSqrtRatioX96 } from '@uniswap/v3-sdk'
import { CurrencyAmount, Token, TradeType, Percent} from "@uniswap/sdk-core";





const { ChainId, Fetcher, DAI, USDC, WETH, Route, Trade, TokenAmount, SwapRouter, Pool } = require ("@uniswap/v3-sdk");
const poolAddress = "0x491bf019dbdf10404e27e0894b920ef893b63f68"
var swapAbi  =require(  "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
var tokens = {
  "BML": "0x0575cBFcA796d335A911D7D9f43f8b4255FFd023",
  "USDC": "0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b",
  "USDT":"0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad",
  "DAI": "0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea",
}
var tokenToFee = {"BML": 500, "DAI": 3000}
const coins = require('./coins.json');
const erc20s = [
"BML",
"USDC",
"DAI",
]
const chains = ["BTC", "ETH"]
const allCoins = _.union(chains,erc20s)
const ethCoins = ["ETH"]  + erc20s

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);
var symbolToPrecision = _.object(_.pluck(coins, 'symbol'), _.pluck(coins, 'decimal'))
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
var symbolToValueUsd = {}
var values = _.map(allCoins, (symbol)=>{
  var value = {}
  var price = 0
  if(_.has(window.prices, symbol)){
    price = window.prices[symbol]
  }
  var value = Number($(`#balance${symbol}`).text() * price);
  symbolToValueUsd[symbol] = value;
  window.totalValue = totalValue
  totalValue += value;
  return [`${symbol}: $${roundUp(value)}`, value]
});

_.each(allCoins, (symbol)=>{
  var percentage = (symbolToValueUsd[symbol] / totalValue) * 100;
  if (totalValue == 0){
    percentage = 0;
  }
  window.percentages[symbol] = percentage;
  $(`#percent${symbol}`).val(roundUp(percentage));
});

var data = google.visualization.arrayToDataTable(data.concat(values))

var options = {
  title: 'Investing\n            $' + roundUp(totalValue),
  titleTextStyle: {fontSize: 20},
  colors: [ '#ff8c00', 'grey', 'red','green', 'blue'],
  legend:{position: 'top', maxLines: 5}
};

var chart = new google.visualization.PieChart(document.getElementById('piechart'));

chart.draw(data, options);
}

$('#rebalanceButton').click( function(e) {
  e.preventDefault()
  if (!window.ethereum.selectedAddress){
    return
  }
  _.each(erc20s, (symbol, index, symbols) => {
    var percentage = 0
    if(_.has(window.percentages, symbol)){
      percentage = window.percentages[symbol]
    }
    const difference = Number($(`#percent${symbol}`)[0].value) - percentage
    if (difference > 0.1){
      const toBuy = difference * window.totalValue / 100;
      swap(toBuy, "USDC", symbol)
    }
  })
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

let currentAccount = null;
detectEthereumProvider().then(provider => {
if (provider) {
  window.provider = provider
  window.ethereum
  .request({ method: 'eth_accounts' })
  .then(handleAccountsChanged)
  .catch((err) => {
    console.error(err);
  });
  window.ethereum.on('accountsChanged', handleAccountsChanged);
  console.log(provider)
} else {
      console.log('Please install MetaMask!');
}
}).catch(error => {
  console.log(error)
})



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
        _.each(erc20s, (symbol) => {
console.log(tokens[symbol])

          balanceOf(currentAccount, tokens[symbol]).then((balance) => {
console.log(symbolToPrecision[symbol])
            console.log(roundUp(balance/Math.pow(10,symbolToPrecision[symbol]), 1))
            $(`#balance${symbol}`).text(roundUp(balance/Math.pow(10,symbolToPrecision[symbol]), 2));
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
    _.each(["BML", "DAI"], (symbol) => {
      balanceOf(window.ethereum.selectedAddress, tokens[symbol]).then((balance) => {

        var value = roundUp(balance/Math.pow(10,symbolToPrecision[symbol]), 2)
        if( value != $(`#balance${symbol}`).text()){
          alert(`You have received ${symbol}!`)
          $(`#balance${symbol}`).text(value);
          drawChart()
        }
      })
    })
  }
  , 3000);

window.prices = {"BML":20, "USDC":1, "USDT" : 1, "DAI": 1}
window.percentages = {}
_.each(_.reject(allCoins, (coin)=>{return coin == "BML" || coin == "USDT" || coin =="DAI"}), (symbol)=>{
  console.log(symbol)
  $.get(`https://api.binance.com/api/v3/avgPrice?symbol=${symbol}BUSD`, (data) => {
    window.prices[symbol] = data.price
    console.log(data.price)
    drawChart()
})

})


async function swap(toBuyUSD, fromToken, toToken){
const fromTokenAddress = tokens[fromToken]
const toTokenAddress = tokens[toToken]

const routerAddress = `0xE592427A0AEce92De3Edee1F18E0157C05861564`; // Kovan Swap Router
const routerContract = new ethers.Contract(routerAddress, routerABI, getSigner());
const expiryDate = Math.floor(Date.now() / 1000) + 9000;

(async () => {
  console.log((roundUp(toBuyUSD)).toString())
console.log(fromToken)
console.log(toToken)

  const numTokensToBuy = toBuyUSD / window.prices[fromToken]
  console.log(numTokensToBuy)
  const qty = ethers.utils.parseUnits(roundUp(numTokensToBuy).toString(), symbolToPrecision[fromToken]);
	console.log(qty.toString());
  const params = {
    tokenIn: fromTokenAddress,
    tokenOut: toTokenAddress,
    fee: tokenToFee[toToken],
    recipient: currentAccount,
    deadline: expiryDate,
    amountIn: qty,
    amountOutMinimum: 0,
    sqrtPriceLimitX96: 0,
  };

  let gas_price = ethers.utils.hexlify(parseInt(2389890000))
	let transactionObject = {
    gasLimit: ethers.utils.hexlify(10000000), // 100000
	};
  routerContract.exactInputSingle(params, transactionObject).then((data)=>{console.log(data)});

})();
}


