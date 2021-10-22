google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);
function roundUp(num, precision=2) {
  precision = Math.pow(10, precision)
  return Math.ceil(num * precision) / precision
}
function balanceOf(address){
        let tokenAddress = "0x0575cBFcA796d335A911D7D9f43f8b4255FFd023";
        var abi = [
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
        const signer = (new ethers.providers.Web3Provider(window.ethereum)).getSigner()
        const contract = new ethers.Contract(tokenAddress, abi, signer);
        return contract.balanceOf(address)
}

function drawChart() {



var data = [['Coin', 'Balance']]
var totalValue = 0
var values = _.map(["BTC", "ETH", "BML"], (symbol)=>{
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
  colors: [ '#ff8c00', 'grey', 'green'],
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
        balanceOf(currentAccount).then((balance) => {
          $('#balanceBML').text(balance/100);
          drawChart()
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

window.prices = {"BML":20, "BTC": 62000, "ETH": 3000}
_.each(["BTC", "ETH"], (symbol)=>{
  $.get(`https://api.binance.com/api/v3/avgPrice?symbol=${symbol}BUSD`, (data) => {
    window.prices[symbol] = data.price
    drawChart()
})

})

