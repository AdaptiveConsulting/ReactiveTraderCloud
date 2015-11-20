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

  var $refTable = $("#refTable"),
  $tableBody = $refTable.find("tbody"),
  rowTemplate = '<tr data-symbol="{Symbol}"><td>{Symbol}</td></tr>',
  $debug = $("#debug");


  function formatStock(stock) {
   return $.extend(stock, {

   });
 }

 var wsuri;
 if (document.location.origin == "file://" || document.location.protocol == "file:") {
   wsuri = "ws://127.0.0.1:8080/ws";

 } else {
   wsuri = (document.location.protocol === "http:" ? "ws:" : "wss:") + "//" +
   document.location.host + "/ws";
 }


// the WAMP connection to the Router
//
var connection = new autobahn.Connection({
 url: wsuri,
 realm: "com.weareadaptive.reactivetrader"
});


var cleared = false;
// fired when connection is established and session attached
//
connection.onopen = function (session, details) {

  console.log("Connected");

   // SUBSCRIBE to a topic and receive events
   //
   function onCurrencyPairUpdate (ccyPair) {
    var symbol = ccyPair.CurrencyPair.Symbol;

      if( ccyPair.UpdateType == 0 ) {// added
       console.log("adding");
       $tableBody.append(rowTemplate.supplant(ccyPair.CurrencyPair));
     }     
     else if( ccyPair.UpdateType == 1 ) {
       console.log("removing");
       $tableBody.find("tr[data-symbol=" + symbol +"]").remove()
     }

   }

   function onCurrencyPairUpdates (ccyPairUpdates) {
    if(!cleared) {
      $tableBody.empty();
      cleared = true;
    }

    var updates = ccyPairUpdates.Updates;
    updates.forEach(onCurrencyPairUpdate);
  }


  createRequestStreamBasic(session, 'reference.getCurrencyPairUpdatesStream', onCurrencyPairUpdates )


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