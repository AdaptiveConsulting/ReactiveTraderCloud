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

    var wsuri= "ws://127.0.0.1:8080/ws";

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

    var direction = $("input[type='radio'][name='direction']:checked").val();

    var request = {
        CurrencyPair: $("#ccyPair").val(),
        SpotRate: $("#spot").val(),
        ValueDate: new Date(),
        Direction: direction,
        Notional: $("#notional").val(),
        DealtCurrency: $("#dealtCcy").val()
    };

    console.log("Built Request object");

    session.call('execution.ExecuteTrade', [createMessage(request, 'Jon')])
        .then(function logResult(res) {
            console.log('Got execution response' + res);
            var status = res.Result.Trade.Status == 1 ? 'Accepted' : "Rejected";
            console.log("Status is " + status);
            $("#executingIndicator").text('Execution Complete. Trade ' + status);
        });

    $("#executingIndicator").text('Executing...');

    console.log("Called ExecuteTrade procedure");

}