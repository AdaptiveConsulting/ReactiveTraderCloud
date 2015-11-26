import autobahn from 'autobahn';
import emitter from './emitter';
import _ from 'lodash';




class PricingService {
  constructor(t) {
    this.transport = t;
  }

  getPriceUpdates(symbol, callback) {
        console.log('called price update' + symbol);
        return this.transport.subscribe('pricing.getPriceUpdates', callback, {symbol});
      }
}

class ReferenceService {
  constructor(t) {
    this.transport = t;
  }

  getCurrencyPairUpdatesStream( callback) {
    console.log('called getCurrencyPairUpdatesStream');
    return this.transport.registerSubscription(callback);
  }
}

// reactiveTrader
//    pricing
//        getPriceUdaptes
//    reference
//        getCurrencyPairUpdates
//    blotter
//

class ReactiveTrader {
  constructor(t) {
    this.pricing = new PricingService(t);
    this.reference= new ReferenceService(t);
  }


}

class Transport extends emitter {
  constructor(url = 'ws://localhost:8080/ws', realm = 'com.weareadaptive.reactivetrader'){
    super();
    this.connection = new autobahn.Connection({
      url,
      realm,
      use_es6_promises: true
    });

    this.pricing = new PricingService(this);

    this.session = {};
    this.connection.onopen = (ws) => {
      console.log('connected');
      this.session = ws;

      // on connection open, subscribe to all queues
      this.subscribeToStatusUpdates();
      this.trigger('open');
    };

    this.connection.onclose = () => {
      this.trigger('close');
    };

    this.queues = [];

    // todo: get this from config
    this.services = {
      pricing:{
        subscriptions: []
      },
      reference:{
        subscriptions: []
      },
      blotter:{
        subscriptions: []
      }
    };

    this.connection.open();
  }

  registerSubscription(handler) {
    const reply = _.uniqueId('queue'+event);
    const sub = {reply, handler, subscriptionID: undefined};
    this.queues.push(sub);

    this.log(sub);
  }

  logHeartbeat(heartbeat) {
    const type = heartbeat.Type,
      typeService = this.services[type],
      instanceID = heartbeat.Instance;

    instanceID in typeService || (typeService[instanceID] = {
      killer: _.debounce(() => this.markAsDead(type, instanceID), 2000)
    });

    typeService[instanceID].killer();
    typeService.subscriptions.forEach((sub) => {
      if (!sub.called){
        sub.called = true;
        sub.instanceID = instanceID;
        this.sessionRPC(sub, instanceID);
      }});
  }

  subscribeToStatusUpdates() {
    this.session.subscribe('status', (a) => this.logHeartbeat(a[0])).then(this.session.log, this.session.log);
  }

  subscribe(event, callback, message = {}){
    // do this in batch
    this.session.subscribe(reply, (a) => callback(a[0])).then((subResult) => {
      sub.subscriptionID = subResult.id;
    }, () => this.session.log);

    // call method calls directly i.e. reference.getCurrencyPairUpdatesStream(handler);
    if (event == 'reference.getCurrencyPairUpdatesStream') {
      this.services.reference.subscriptions.push({
        proc: 'getCurrencyPairUpdatesStream',
        message, reply,
        called: false
      });
      console.log('added subscription', this.services);
    }

    // call method calls directly i.e. pricing.getPriceUpdates(ccyPair, handler);
    if(event == 'pricing.getPriceUpdates') {
      this.services.pricing.subscriptions.push({proc: 'getPriceUpdates', message, reply, called: false});
      console.log('added subscription', this.services);
    }

  }

  sessionRPC(sub, instanceID){
    var ins = instanceID +'.'+ sub.proc;
    this.session.call(ins, [{replyTo: sub.reply, payload: sub.message}]).then(_ => console.log('called'),err=>{sub.called = false; sub.instanceID = undefined;});
  }

  unsubscribe(...args){
    return this.session.unsubscribe(...args);
  }



  markAsDead(type, instanceID) {
    console.log('killing ' + instanceID);
    console.log(this.services[type].subscriptions);
     this.services[type].subscriptions.forEach( sub=>{ if( sub.instanceID == instanceID ) { console.log('marked subscription ' + sub.proc); sub.called = false; sub.instanceID = undefined; }});
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
   console.log(...args);

  }

  prefix(...args){
    this.session.prefix(...args);
  }
}

export default new ReactiveTrader(new Transport);
//export default new Transport;
