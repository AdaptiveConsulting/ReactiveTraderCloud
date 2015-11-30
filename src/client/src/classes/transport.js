import autobahn from 'autobahn';
import emitter from './emitter';
import _ from 'lodash';

const HEARTBEAT_TIMEOUT = 3000;

/**
 * @class ServiceDef
 */
class ServiceDef extends emitter {
  /**
   * @constructs ServiceDef
   * @param {transport} transport
   */
  constructor(transport:Transport){
    super();

    this.pendingSubscriptions = [];
    this.instances = {};
    this.transport = transport;
  }

  registerOrUpdateInstance(instance, load){
    if (!(instance in this.instances)){
      (this.instances[instance] = this.createNewInstance(instance, load));
      this.trigger('addInstance');
    }

    const instanceDef = this.instances[instance];
    instanceDef.keepalive();
    instanceDef.load = load;
  }

  createNewInstance(instance, load){
    console.log('add instance', instance);

    const instanceRef = {
      keepalive: _.debounce(() => this.killInstance(instance), HEARTBEAT_TIMEOUT),
      subscriptions: [],
      load
    };

    while (this.pendingSubscriptions.length > 0){
      const p = this.pendingSubscriptions.pop();
      instanceRef.subscriptions.push(p);
      this.transport.remoteCall(p, instance).then(this.log);
    }

    return instanceRef;
  }

  killInstance(instance){
    console.log('killing instance', instance);
    const instanceToKill = this.instances[instance];
    // if server dies, this may already be cleaned up. function is debounced to check every `HEARTBEAT_TIMEOUT`ms.
    if (!instanceToKill)
      return;

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

  /**
   * @param {Object} subscription
   * @returns {}
   */
  addSubscription(subscription:object){
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
      console.log('adding subscription to pending', subscription);
      this.pendingSubscriptions.push(subscription);
      return this;
    }

    picked.subscriptions.push(subscription);
    this.transport.remoteCall(subscription, pickedInstanceID);

    return this;
  }

  /**
   * @param {Object} proc
   * @returns {}
   */
  requestResponse(subscription){
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

    return new Promise((resolve, reject) => {

      if (!pickedInstanceID){
        return reject(new Error('No instance for ' + proc));
      }
      this.transport.remoteCall(subscription, pickedInstanceID).then(resolve, reject);

    });
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

    this.username = 'user-' + (Math.random() * Math.pow(36, 8) << 0).toString(36); // todo maybe do some slightly better authentication
    this.queues = [];
    this.session = {
      log: (...args) => console.log(...args)
    };
    this.services = {
      pricing: new ServiceDef(this),
      reference: new ServiceDef(this),
      blotter: new ServiceDef(this),
      execution: new ServiceDef(this)
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
      this.trigger('statusUpdate', this.getStatus());
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
    const name = 'queue' + (Math.random() * Math.pow(36, 8) << 0).toString(36);
    return this.subscribeToTopic(name, handler);
  }

  requestStream(serviceName, callName, args, callback){
    const queue = this.createQueue(callback);
    this.registerSubscription(serviceName, callName, queue, args);
  }

  /**
   * Requests an immediate response
   * @param {String} serviceName
   * @param {String} callName
   * @param {Object=} message
   * @returns {*}
   * */
  requestResponse(serviceName:string, callName:string, message:object = {}){
    return this.services[serviceName].requestResponse({
      proc: callName,
      message
    });
  }

  subscribeToTopic(name, handler){
    const sub = {
      replyToAddress: name,
      handler
    };

    this.queues.push(sub);

    if (!_.isPlainObject(this.session)){
      this._subscribe(sub);
    }

    return sub;
  }

  registerSubscription(serviceType, serviceProcName, responseQueue, request){
    this.services[serviceType].addSubscription({
      proc: serviceProcName,
      replyTo: responseQueue,
      message: request
    });
  }

  /**
   * @param {Object=} heartbeat
   * @returns {Transport}
   */
  logHeartBeat(heartbeat:object){
    const type        = heartbeat.Type,
          typeService = this.services[type],
          instanceID  = heartbeat.Instance;

    typeService.registerOrUpdateInstance(instanceID, heartbeat.Load);

    return this;
  }

  /**
   * @returns {*}
   */
  subscribeToStatusUpdates(){
    return this.subscribeToTopic('status', (...args) => this.logHeartBeat(...args));
  }

  /**
   * @returns {Transport}
   */
  subscribeToQueues(){
    console.log('subscribing to queues');

    this.queues.forEach((queuedItem:object) =>{
      if (queuedItem.subscriptionID == null){
        this._subscribe(queuedItem);
      }
    });

    return this;
  }

  /**
   * Cleans up after a connection fails
   * @returns {Transport}
   */
  markEverythingAsDead(){
    console.log('marking queues as dead');
    this.queues.forEach((q) => delete q.subscriptionID);

    console.log('marking instances as dead');
    for (let service in this.services){
      this.services[service].markEverythingAsDead();
    }

    return this;
  }

  /**
   * Low level API to autobahn subscribe, kind of private
   * @param {object} subscription
   * @returns {*}
   * @private
   */
  _subscribe(subscription:object){
    this.session.subscribe(subscription.replyToAddress, (response) => subscription.handler(response[0])).then((subResult) =>{
      subscription.subscriptionID = subResult;
    }, (error) => console.error(error));

    return subscription;
  }

  /**
   * @param {Object} subscription
   * @param {String} instanceID
   * @returns {{log: Transport.session.log}|*}
   */
  remoteCall(subscription:object, instanceID:string){
    const ins = instanceID + '.' + subscription.proc,
      replyTo = subscription.replyTo && subscription.replyTo.replyToAddress ? subscription.replyTo.replyToAddress : undefined;

    // console.log(ins);

    return this.session.call(ins, [{
      replyTo,
      Username: this.username,
      payload: subscription.message
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

export default new Transport;
