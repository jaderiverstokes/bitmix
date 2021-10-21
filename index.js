google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);
function drawChart() {

var data = google.visualization.arrayToDataTable([
['Coin', 'Balance'],
['BTC', Number($('#balanceBTC').text())],
['ETH', Number($('#balanceETH').text())],
]);

var options = {
title: 'Portfolio',
  colors:[ '#ff8c00', 'grey']
};

var chart = new google.visualization.PieChart(document.getElementById('piechart'));

chart.draw(data, options);
}
$('#submitButton').click( function(e) {
  e.preventDefault()
  $.post( '/add', $('form#addressForm').serialize(), function(balanceBTC) {
    window.balanceBTC = balanceBTC;
    $('#balanceBTC').text(balanceBTC/ 100000000);
    drawChart()
    $('#verifiedBTC').css("display","inline");
       },
       'json'
    ,function(err){console.log(err)});
});

detectEthereumProvider().then(provider => {
if (provider) {
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
    console.log(currentAccount)
    window.ethereum
      .request({ method: 'eth_getBalance', params: [currentAccount, 'latest'] })
      .then((balance) => {
        const weiValue = parseInt(Number(balance), 10)
        const balanceETH = ethers.utils.formatEther(weiValue);
        $('#balanceETH').text(balanceETH);
        drawChart()
        $('#verifiedETH').css("display","inline");
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


$(document).ready(function(){




});
