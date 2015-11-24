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
  rowTemplate = '<tr data-symbol="{Symbol}"><td>{Symbol}</td></tr>';


 var wsuri = "ws://127.0.0.1:8080/ws";



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
  console.log(details);

  var services = ['price', 'ref', 'blotter'];
  var openings = Rx.Observable.interval(2000);

  var source = Rx.Observable.create(obs => {
      createSubscription(session, 'status',  function(val) { obs.onNext(val); }, function(err) {console.log('err' + err);});
      return () => console.log('disposed');
  });

  function calculateState(listOfHeartbeats) {
    function exists(list, s) {
      for (var i = 0; i < list.length; i++) {
        if( list[i].Type == s ) return 'up';
      };
      return 'down';
    }

    var status = {};
    var up = services.forEach(function(serviceName) {
      status[serviceName] = exists(listOfHeartbeats, serviceName);
    });

    return status;
   }

   function render(state) {
       $tableBody.empty();

       for( i in state )  {
          if(state[i]=='up') 
            $tableBody.append('<tr><td style=\'background-color:green\'>'+i+'</td></tr>');
          else if(state[i]=='down') 
            $tableBody.append('<tr><td style=\'background-color:red\'>'+i+'</td></tr>');
          else 
            $tableBody.append('<tr><td>'+i+'</td></tr>');
      }
   }

  function initialState() {
    var status = {};
    var up = services.forEach(function(serviceName) {
      status[serviceName] = 'unknown'
    });

    return status;
   }

   var subscription = source.buffer(openings).select(x=>calculateState(x)).startWith(initialState()).subscribe(x => render(x));

   connection.onclose = function (reason, details) {
   console.log("Connection lost: " + reason);
  }
}

// now actually open the connection
//
connection.open();
});