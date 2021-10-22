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

function drawChart() {



var data = [['Coin', 'Balance']]
var totalValue = 0
var values = _.map(["BTC", "ETH", "BML", "USDC"], (symbol)=>{
  var price = window.prices[symbol]
  var value = Number($(`#balance${symbol}`).text() * price);
  totalValue += value;
  return [`${symbol}: $${roundUp(value)}`, value]
}
);

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
  swap()
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
_.each(["BTC", "ETH", "USDC"], (symbol)=>{
  $.get(`https://api.binance.com/api/v3/avgPrice?symbol=${symbol}BUSD`, (data) => {
    window.prices[symbol] = data.price
    drawChart()
})

})


async function swap(){

  //const chainId = ChainId.RINKEBY;
  //console.log(chainId)

  //const usdc = await Fetcher.fetchTokenData(chainId, tokens["USDC"], getSigner());
  //console.log(usdc)
  //const bml = await Fetcher.fetchTokenData(chainId, tokens["BML"], getSigner());

  //const pair = await Fetcher.fetchPairData(usdc, bml, getSigner());
  //console.log(pair)
  //
  
  const feeAmount = FeeAmount.MEDIUM
  const sqrtRatioX96 = encodeSqrtRatioX96(1, 1)
  const liquidity = 1_000_000
  const makePool = (token0, token1) => {
    return new Pool(token0, token1, feeAmount, sqrtRatioX96, liquidity, TickMath.getTickAtSqrtRatio(sqrtRatioX96), [
      {
        index: nearestUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[feeAmount]),
        liquidityNet: liquidity,
        liquidityGross: liquidity
      },
      {
        index: nearestUsableTick(TickMath.MAX_TICK, TICK_SPACINGS[feeAmount]),
        liquidityNet: -liquidity,
        liquidityGross: liquidity
      }
    ])
  }

  const amountIn = 1500;
  const token0 = new Token(1, tokens["USDC"], 6, "USDC", "USD Coin");
  const token1 = new Token(1, tokens["BML"], 100, "BML", "Bitmix Ledger");
  const pool_0_1 = makePool(token0, token1);
  console.log(pool_0_1);
  const poolContract = new ethers.Contract(poolAddress, swapAbi.abi, getSigner());
  //console.log(poolContract)
  //window.poolContract = poolContract
  const route = new Route([pool_0_1], token0, token1);
  console.log(route);
  const trade = await Trade.fromRoute(
        route,
        CurrencyAmount.fromRawAmount(token0, 100),
        TradeType.EXACT_INPUT
  );
  console.log(trade)
  const slippageTolerance = new Percent(1, 100);
  //const sw = SwapRouter.swapCallParameters(trade, {slippageTolerance:slippageTolerance, recipient:window.ethereum.selectedAddress, deadline:123,
        //fee: {
            //fee: new Percent(5, 1000),
            //recipient:window.ethereum.selectedAddress
          //}
  //})
  // create an unchecked trade instance
   const uncheckedTradeExample = await Trade.createUncheckedTrade({    route: route,    inputAmount: CurrencyAmount.fromRawAmount(token0, amountIn.toString()),    outputAmount: CurrencyAmount.fromRawAmount(      token1,      1000   ),    tradeType: TradeType.EXACT_INPUT,  });

console.log(uncheckedTradeExample)
  //window.signer = getSigner();
  //var a = await getSigner().provider.call(poolAddress,sw.calldata);
  //console.log(a)
//console.log(sw)
  //window.sw=sw

  //console.log(abi)
  //console.log(window.provider)
//const poolImmutablesAbi = [  "function factory() external view returns (address)",  "function token0() external view returns (address)",  "function token1() external view returns (address)",  "function fee() external view returns (uint24)",  "function tickSpacing() external view returns (int24)",  "function maxLiquidityPerTick() external view returns (uint128)",];
  ////const poolContract = new ethers.Contract(  poolAddress,  poolImmutablesAbi,  getSigner());

  //console.log(poolContract)
  //window.poolContract = poolContract

  //async function getPoolImmutables() {
    //const [factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick] =   await Promise.all([
      //poolContract.factory(),
      //poolContract.token0(),
      //poolContract.token1(),
      //poolContract.fee(),
      //poolContract.tickSpacing(),
      //poolContract.maxLiquidityPerTick(),
    //]);
    //const immutables= {
      //factory,
      //token0,
      //token1,
      //fee,
      //tickSpacing,
      //maxLiquidityPerTick,
    //};
    //return immutables;
  //}


  //async function getPoolState() {  // note that data here can be desynced if the call executes over the span of two or more blocks.
    //const [liquidity, slot] = await Promise.all([poolContract.liquidity(), poolContract.slot0()]);
    //const PoolState = {
      //liquidity,
      //sqrtPriceX96: slot[0],
      //tick: slot[1],
      //observationIndex: slot[2],
      //observationCardinality: slot[3],
      //observationCardinalityNext: slot[4],
      //feeProtocol: slot[5],
      //unlocked: slot[6]
    //};
    //return PoolState;
  //}
  ////const poolAddress = await uniswapFactory.getPool(token0Address, token1Address, poolFee);
  ////const st = await getPoolState();
////console.log(st)
  ////const immutables = await getPoolImmutables();

////const DAI_USDC_POOL = new Pool(    DAI,    USDC,    500);
  ////console.log(immutables)
  ////window.immutables = immutables
  ////const [immutables, state] = await Promise.all([    getPoolImmutables(),    getPoolState(),  ]);
  ////UniswapV3Factory.getPool()
  //const state = await getPoolState();
  //// create instances of the Token object to represent the two tokens in the given pool
  //console.log('so')
  ////console.log(immutables)
  ////console.log(immutables.token0.value())
  //const TokenA = new Token(3, immutables.token0, 6, "USDC", "USD Coin");
  //console.log('hi')
  //////console.log(immutables.token1)
//console.log(state)

  //window.state= state
  //const TokenB = new Token(3, tokens["BML"], 100, "BML", "Bitmix Ledger");
  //console.log('there')
  //// create an instance of the pool object for the given pool
  //const poolExample = new Pool(    TokenA,    TokenB,    
    //500, 
    //100000, //note the description discrepancy - sqrtPriceX96 and sqrtRatioX96 are interchangable values
     //[ 1389262056, -1079304777, -1721588872, 19633, false ],  [ 988036789, -62655684, 1, false ]
  //);
  //console.log('how')
  //// assign an input amount for the swap
  //console.log('are')
  //const swapRoute = new Route([poolExample], TokenA, TokenB);
  //console.log('you')

  //const uncheckedTradeExample = await Trade.createUncheckedTrade({    route: swapRoute,    inputAmount: CurrencyAmount.fromRawAmount(TokenA, amountIn.toString()),    outputAmount: CurrencyAmount.fromRawAmount(      TokenB,      quotedAmountOut.toString()    ),    tradeType: TradeType.EXACT_INPUT,  });

  //console.log(uncheckedTradeExample)
}
