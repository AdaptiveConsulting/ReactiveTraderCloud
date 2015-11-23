if (!String.prototype.supplant){
  String.prototype.supplant = function(o){
    return this.replace(/{([^{}]*)}/g,
      function(a, b){
        var r = o[b];
        return typeof r === "string" || typeof r === "number" ? r : a;
      }
    );
  };
}

$(function(){

  var wsuri;
  if (document.location.origin == "file://"){
    wsuri = "ws://127.0.0.1:8080/ws";

  } else {
    wsuri = (document.location.protocol === "http:" ? "ws:" : "wss:") + "//" +
      document.location.host + "/ws";
  }

  wsuri = "ws://127.0.0.1:8080/ws";

// the WAMP connection to the Router
//
  var connection = new autobahn.Connection({
    url: wsuri,
    realm: "com.weareadaptive.reactivetrader"
  });

  var cleared = false;
// fired when connection is established and session attached
//
  connection.onopen = function(session, details){

    console.log("Connected");

    // SUBSCRIBE to a topic and receive events

    function onPriceUpdate(priceUpdate){
      console.log(priceUpdate.symbol + ': ' + priceUpdate.mid);
    }

    function onCCYsUpdate(CurrencyPairUpdatesDto){
      console.log(CurrencyPairUpdatesDto);

      CurrencyPairUpdatesDto.Updates.forEach(function(ccy){
        console.log(ccy);
        createRequestStream(session, 'pricing.getPriceUpdates', {'symbol': ccy.CurrencyPair.Symbol}, onPriceUpdate, function(err){
          console.log(err);
        });
      });
    }

    createRequestStream(session, 'reference.getCurrencyPairUpdatesStream', {}, onCCYsUpdate, function(err){
      console.log(err);
    });

// fired when connection was lost (or could not be established)
//
    connection.onclose = function(reason, details){
      console.log("Connection lost: " + reason);
    }
  }

// now actually open the connection
//
  connection.open();
});
