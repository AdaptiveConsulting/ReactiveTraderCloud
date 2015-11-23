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

    connection.onopen = function(session, details) {
        console.log("Connected");

        var button = $("#executeTradeButton")
        button.click(function() {
            executeTrade(session);
        });

        connection.onclose = function(reason, details) {
            console.log("Connection lost: " + reason);
        }
    }

    // now actually open the connection
    //
    connection.open();
});

function executeTrade(session) {

    var request = {
        CurrencyPair: $("#ccyPair").val(),
        SpotRate: $("#spot").val(),
        ValueDate: new Date(),
        Direction: 'Buy',
        Notional: $("#notional").val(),
        DealtCurrency: $("#dealtCcy").val()
    };

    console.log("Built Request object");

    session.call('execution.ExecuteTrade', [createMessage(request)])
        .then(function logResult(res) {
            console.log('Got execution response' + res);
            console.log("Status is " + res.Result.Trade.Status);
        });

    console.log("Called ExecuteTrade procedure");

}