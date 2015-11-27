if (!String.prototype.supplant) {
  String.prototype.supplant = function(o) {
    return this.replace(/{([^{}]*)}/g,
      function(a, b) {
        var r = o[b];
        return typeof r === "string" || typeof r === "number" ? r : a;
      }
      );
  };
}

$(function() {

// the WAMP connection to the Router
//
var connection = new autobahn.Connection({
transports: [
      {
         'type': 'websocket',
         'url': 'ws://127.0.0.1:8080/ws',
      },
      {
         'type': 'longpoll',
         'url': 'http://127.0.0.1:9000/lp'
      }
   ],
 realm: "com.weareadaptive.reactivetrader"
});


var cleared = false;
// fired when connection is established and session attached
//
connection.onopen = function (session, details) {

  console.log("Connected");

   function onTradeUpdate (tradesDto) {
     console.log(tradesDto);
   }


   createRequestStream(session, 'blotter.getTradesStream', {}, onTradeUpdate, function(err) {console.log(err);});
  


// fired when connection was lost (or could not be established)
//
  connection.onclose = function (reason, details) {
   console.log("Connection lost: " + reason);
  }
}

// now actually open the connection
//
connection.open();
});