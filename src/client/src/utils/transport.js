import autobahn from 'autobahn';
import emitter from './emitter';
import _ from 'lodash';

// reactiveTrader.
//    getStatusUpdates()
//    pricing.getPriceUdaptes(symbol)
//    reference.getCurrencyPairUpdates()
//    blotter...()
//


class PricingService {
  constructor(t) {
    this.transport = t;
  }

  getPriceUpdates(symbol, callback) {
    console.log('called getPriceUpdates('+ symbol +')');
    const queue = this.transport.createQueue(callback);
    this.transport.registerSubscription('pricing', 'getPriceUpdates', queue, {symbol});
    return queue;
  }
}

class ReferenceService {
  constructor(t) {
    this.transport = t;
  }

  getCurrencyPairUpdatesStream(callback) {
    console.log('called getCurrencyPairUpdatesStream');
    // register call
    const queue = this.transport.createQueue(callback);
    this.transport.registerSubscription('reference', 'getCurrencyPairUpdatesStream', queue, {});
    return queue;
  }
}

class BlotterService {
  constructor(t) {
    this.transport = t;
  }

  getTradesStream(callback) {
    console.log('called getTradesStream');
    return this.transport.createQueue(callback);
  }
}

class ExecutionService {
  constructor(t) {
    this.transport = t;
  }

  executeTrade(callback) {
    console.log('called executeTrade');
    // should return value
  }
}


class ReactiveTrader {
  constructor(t) {
    this.pricing = new PricingService(t);
    this.reference = new ReferenceService(t);
    this.blotter = new BlotterService(t);
    this.execution = new ExecutionService(t);

    this.transport = t;
  }

  subscribeToStatusUpdate(handler) {
    this.transport.subscribeToStatusUpdate(handler);
  }
}

class ServiceDef {
  constructor(t) {
    this.pendingSubscriptions = [];
    this.instances = {};
    this.transport = t;
  }

  registerOrUpdateInstance(instance, load) {
    instance in this.instances || (
      this.instances[instance] = this.createNewInstance(instance, load)
    );

    const instanceDef = this.instances[instance];
    instanceDef.keepalive();
    instanceDef.load = load;
  }

  createNewInstance(instance, load) {
    var instanceRef = {
      keepalive: _.debounce(() => this.killInstance(instance), 2000),
      subscriptions: [],
      load
    };

    while (this.pendingSubscriptions.length > 0) {
      var p = this.pendingSubscriptions.pop();
      instanceRef.subscriptions.push(p);

      console.log('remoteCall', p, instance);
      this.transport.remoteCall(p, instance);
    }

    return instanceRef;
  }

  killInstance(instance) {
    console.log('killing instance', instance );
  }

  killAllInstances() {
    // move everything to pending...
  }

  addSubscription(subscription) {
    // strategy, grab the one with least load
    var min = 1000;
    var picked = undefined;
    var pickedInstanceID = undefined;
    for (var instance in this.instances) {
      var current = this.instances[instance];

      if(current.load < min ) {
        min = current.load;
        picked = current;
        pickedInstanceID = instance;
      }
    }

    if( !picked ) {
      this.pendingSubscriptions.push(subscription);
      console.log('adding subscription to pending', subscription);
      return;
    }

    this.transport.remoteCall(subscription, pickedInstanceID);
  }
}

class Transport extends emitter {
  constructor(url = 'ws://' + location.hostname + ':8080/ws', realm = 'com.weareadaptive.reactivetrader') {
    super();
    this.connection = new autobahn.Connection({
      url,
      realm,
      use_es6_promises: true
    });

    this.queues = [];
    this.session = undefined;
    this.services = {
      pricing: new ServiceDef(this),
      reference: new ServiceDef(this),
      blotter: new ServiceDef(this)
    };

    this.subscribeToStatusUpdates();


    this.connection.onopen = (ws) => {
      this.pushChangeOfState({messageBroker: 'connected'});

      this.session = ws;

      this.subscribeToQueues();
      this.trigger('open');
    };

    this.connection.onclose = () => {
      this.pushChangeOfState({messageBroker: 'disconnected'});

      this.trigger('close');
      this.markEverythingAsDead();
    };
    this.connection.open();
  }

  createQueue(handler) {
    const name = _.uniqueId('queue');
    return this.subscribeToTopic(name, handler);
  }

  subscribeToTopic(name, handler) {
    const sub = {replyToAddress: name, handler, subscriptionID: undefined};
    this.queues.push(sub);

    if (this.session)
      this.subscribe(sub);

    return sub;
  }

  pushChangeOfState(obj) {
    console.log(obj);
  }

  registerSubscription(serviceType, serviceProcName, responseQueue, request) {
    var typeService = this.services[serviceType];
    typeService.addSubscription({proc: serviceProcName, replyTo: responseQueue, message: request});
  }

  logHeartBeat(heartbeat) {
    const type = heartbeat.Type,
      typeService = this.services[type],
      instanceID = heartbeat.Instance;

    typeService.registerOrUpdateInstance(instanceID, heartbeat.Load);
  }

  // TODO move to ReactiveTrader
  subscribeToStatusUpdates() {
    this.subscribeToTopic('status', (h) => this.logHeartBeat(h));
  }

  subscribeToQueues() {
    this.log('subscribing to queues');

    this.queues.forEach((q) => {
      if( !q.subscriptionID ) {
        this.subscribe(q);
      }
    });
  }

  markEverythingAsDead() {
    this.queues.forEach((q) => q.subscriptionID = undefined);

    for(service in this.services) {
      this.services[service].markEverythingAsDead();
    }
  }

  // TODO make this private?
  subscribe(sub){
    this.session.subscribe(sub.replyToAddress, (a) => sub.handler(a[0])).then((subResult) => {
      sub.subscription = subResult;
    }, () => this.session.log);

    return sub;
  }

  remoteCall(sub, instanceID){
    var ins = instanceID +'.'+ sub.proc;
    this.session.call(ins, [{replyTo: sub.replyTo.replyToAddress, payload: sub.message}]).then(o => {},err=>{});
  }

  unsubscribe(...args){
    return this.session.unsubscribe(...args);
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

export default new ReactiveTrader(new Transport());
