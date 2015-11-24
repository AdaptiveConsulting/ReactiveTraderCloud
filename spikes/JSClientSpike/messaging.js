function createMessage(payload){
  var mess = {
    ReplyTo: newQueueName(),
    Payload: payload,
  };

  return mess;
}

function newQueueName(){
  function s4(){
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function createRequestStream(session, destination, request, onUpdate, onError){
  console.log('create stream');

  var message = createMessage(request);

  console.log(message);
  console.log('queue name = ' + message.ReplyTo);

  var debug = function(sub){
    console.log(sub)
  };
  var error = function(err){
    alert(err);
  }

  var wampRPCError = function(err){
    if (err.error == 'wamp.error.no_such_procedure')
      onError('no servers up for ' + destination);
    else
      onError(err.error);
  }

  console.log(destination, request, onUpdate);

  session.subscribe(message.ReplyTo, function(dto){
    onUpdate(dto[0]);
  }).then(
    function(val){
      console.log('subscribe call');
      session.call(destination, [message]).then(function(val){
        console.log('success');
      }, wampRPCError)
    }, onError);

  // start timer to 'send heartbeat'
  // subscribe to timer 'req.heartbeat'
}

function createRequestStreamBasic(session, destination, onUpdate){
  return createRequestStream(session, destination, {}, onUpdate, function(err){
    console.log(err);
  });
}
