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
  constructor(t){
    this.transport = t;
  }

  getPriceUpdates(symbol, callback){
    console.log('called getPriceUpdates(' + symbol + ')');
    const queue = this.transport.createQueue(callback);
    this.transport.registerSubscription('pricing', 'getPriceUpdates', queue, {symbol});
    return queue;
  }
}

class ReferenceService {
  constructor(t){
    this.transport = t;
  }

  getCurrencyPairUpdatesStream(callback){
    console.log('called getCurrencyPairUpdatesStream');
    // register call
    const queue = this.transport.createQueue(callback);
    this.transport.registerSubscription('reference', 'getCurrencyPairUpdatesStream', queue, {});
    return queue;
  }
}

class BlotterService {
  constructor(t){
    this.transport = t;
  }

  getTradesStream(callback){
    console.log('called getTradesStream');
    return this.transport.createQueue(callback);
  }
}

class ExecutionService {
  constructor(t){
    this.transport = t;
  }

  executeTrade(callback){
    console.log('called executeTrade');
    // should return value
  }
}

class ReactiveTrader {
  constructor(t){
    this.pricing = new PricingService(t);
    this.reference = new ReferenceService(t);
    this.blotter = new BlotterService(t);
    this.execution = new ExecutionService(t);

    this.transport = t;
  }
}

class ServiceDef extends emitter {
  constructor(t){
    super();

    this.pendingSubscriptions = [];
    this.instances = {};
    this.transport = t;
  }

  registerOrUpdateInstance(instance, load){
    if (!(instance in this.instances)){
      (this.instances[instance] = this.createNewInstance(instance, load));
      this.trigger('addInstance')
    }

    const instanceDef = this.instances[instance];
    instanceDef.keepalive();
    instanceDef.load = load;
  }

  createNewInstance(instance, load){
    console.log('add instance', instance);

    const instanceRef = {
      keepalive: _.debounce(() => this.killInstance(instance), 3000),
      subscriptions: [],
      load
    };

    while (this.pendingSubscriptions.length > 0){
      const p = this.pendingSubscriptions.pop();
      instanceRef.subscriptions.push(p);

      console.log('remoteCall', p, instance);
      this.transport.remoteCall(p, instance).then(this.log);
    }

    return instanceRef;
  }

  killInstance(instance){
    console.log('killing instance', instance);
    const instanceToKill = this.instances[instance];
    delete this.instances[instance];
    instanceToKill.subscriptions.forEach((s) => this.addSubscription(s));

    this.trigger('removeInstance');
  }

  markEverythingAsDead(){
    // move everything to pending...
    for (let instance in this.instances){
      this.instances[instance].subscriptions.forEach((s) => this.pendingSubscriptions.push(s));
      delete this.instances[instance];
    }
  }

  addSubscription(subscription){
    // strategy, grab the one with least load
    let min = 1000,
        picked,
        pickedInstanceID;

    for (let instance in this.instances){
      let current = this.instances[instance];

      if (current.load < min){
        min = current.load;
        picked = current;
        pickedInstanceID = instance;
      }
    }

    if (!picked){
      this.pendingSubscriptions.push(subscription);
      console.log('adding subscription to pending', subscription);
      return;
    }

    picked.subscriptions.push(subscription);
    this.transport.remoteCall(subscription, pickedInstanceID);
  }
}

/**
 * @class Transport
 * @extends emitter
 */
class Transport extends emitter {

  //todo: move to config for env
  /**
   * @constructs Transport
   * @param {String=} url
   * @param {String=} realm
   */
  constructor(url = 'ws://' + location.hostname + ':8080/ws', realm = 'com.weareadaptive.reactivetrader'){
    super();

    this.connection = new autobahn.Connection({
      url,
      realm,
      use_es6_promises: true
    });

    this.queues = [];
    this.session = {
      log: (...args) => console.log(...args)
    };
    this.services = {
      pricing: new ServiceDef(this),
      reference: new ServiceDef(this),
      blotter: new ServiceDef(this)
    };

    // sub for all known services
    Object.keys(this.services).forEach((service) => this.services[service].on('addInstance removeInstance', () => this.trigger('statusUpdate', this.getStatus())));

    this.subscribeToStatusUpdates();

    this.connection.onopen = (ws) =>{
      this.session = ws;
      this.subscribeToQueues();
      this.trigger('open');
    };

    this.connection.onclose = () =>{
      this.markEverythingAsDead();
      this.trigger('close');
    };

    this.connection.open();
  }

  /**
   * Returns node status per service as map
   * @returns {Object}
   */
  getStatus(){
    const statusObject = {};
    Object.keys(this.services).forEach((service) => statusObject[service] = Object.keys(this.services[service].instances).length);

    return statusObject;
  }

  createQueue(handler){
    const name = _.uniqueId('queue');
    return this.subscribeToTopic(name, handler);
  }

  subscribeToTopic(name, handler){
    const sub = {
      replyToAddress: name,
      handler
    };

    this.queues.push(sub);

    if (!_.isPlainObject(this.session)){
      this.subscribe(sub);
    }

    return sub;
  }

  registerSubscription(serviceType, serviceProcName, responseQueue, request){
    this.services[serviceType].addSubscription({proc: serviceProcName, replyTo: responseQueue, message: request});
  }

  logHeartBeat(heartbeat){
    const type        = heartbeat.Type,
          typeService = this.services[type],
          instanceID  = heartbeat.Instance;

    typeService.registerOrUpdateInstance(instanceID, heartbeat.Load);
  }

  // TODO move to ReactiveTrader
  subscribeToStatusUpdates(){
    this.subscribeToTopic('status', (...args) => this.logHeartBeat(...args));
  }

  subscribeToQueues(){
    console.log('subscribing to queues');

    this.queues.forEach((q) =>{
      if (q.subscriptionID == null){
        this.subscribe(q);
      }
    });
  }

  markEverythingAsDead(){
    console.log('marking queues as dead');
    this.queues.forEach((q) => delete q.subscriptionID);

    console.log('marking instances as dead');
    for (let service in this.services){
      this.services[service].markEverythingAsDead();
    }
  }

  // TODO make this private?
  subscribe(sub){
    this.session.subscribe(sub.replyToAddress, (a) => sub.handler(a[0])).then((subResult) =>{
      sub.subscriptionID = subResult;
    }, (error) => console.error(error));

    return sub;
  }

  remoteCall(sub, instanceID){
    const ins = instanceID + '.' + sub.proc;
    console.log(ins);

    return this.session.call(ins, [{
      replyTo: sub.replyTo.replyToAddress,
      payload: sub.message
    }]);
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
    //console.info(...args);
    this.session.log(...args);
  }

  prefix(...args){
    this.session.prefix(...args);
  }
}

export default new ReactiveTrader(new Transport());
