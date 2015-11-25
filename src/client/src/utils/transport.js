import autobahn from 'autobahn';
import emitter from './emitter';
import _ from 'lodash';


class Transport extends emitter {

  constructor(url = 'ws://localhost:8080/ws', realm = 'com.weareadaptive.reactivetrader'){
    super();
    this.connection = new autobahn.Connection({
      url,
      realm,
      use_es6_promises: true
    });

    this.session = {
      subscriptions: []
    };

    this.connection.onopen = (ws) => {
      this.session = ws;
      this.trigger('open');
    };

    this.connection.onclose = () => {
      this.trigger('close');
    };

    this.services = {};

    this.monitor = _.debounce(this.monitor, 5000);
    this.connection.open();
  }

  subscribe(event, callback, options = {}){
    const reply = _.uniqueId(event);

    this.session.subscribe(reply, (a) => {
      callback(a[0]);
    }, options).then(() => this.sessionRPC({
        ReplyTo: reply,
        Payload: options,
        event
      }));
  }

  sessionRPC(obj){
    // console.log(response);
    const { event } = obj;
    delete obj.event;

    this.session.call(event, [obj]).then((rpcResponse) => {
      rpcResponse.InstanceID in this.services || (this.services[rpcResponse.InstanceID] = []);
      this.services[rpcResponse.InstanceID] = obj;
      this.services[rpcResponse.InstanceID].event = event;
    });
  }

  unsubscribe(...args){
    return this.session.unsubscribe(...args);
  }

  monitor(){
    this.log('Connection has gone down');
  }

  publish(...args){
    return this.session.publish(...args);
  }

  open(){
    return this.session.open();
  }

  close(){
    return this.session.close();
  }

  // connection getters
  get isConnected(){
    return this.connection.isConnected;
  }

  get isOpen(){
    return this.connection.isOpen;
  }

  get isRetrying(){
    return this.connection.isRetrying;
  }

  get info(){
    return this.connection.info;
  }

  // session getters
  get subscriptions(){
    return this.session.subscriptions;
  }

  get features(){
    return this.session.features;
  }

  log(...args){
    this.session.log(...args);
  }

  prefix(...args){
    this.session.prefix(...args);
  }

}

export default new Transport;
