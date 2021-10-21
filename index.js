
console.log("hi")
console.log($('form#addressForm').serialize());
$('#submitButton').click( function(e) {
  console.log('there')
  e.preventDefault()
  console.log(e)
  $.post( '/add', $('form#addressForm').serialize(), function(data) {
         // ... do something with response from server
         console.log('data');
         console.log(data);
    console.log($('#balance').html())
    $('#balance').text("\u20BF " + data/ 100000000);
    $('#verified').css("display","inline");
       },
       'json'
    ,function(err){console.log(err)});
});
