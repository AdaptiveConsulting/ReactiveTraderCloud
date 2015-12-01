import autobahn from 'autobahn';
import emitter from './emitter';
import traders from './traders';
import ServiceDef from './services/service-def';

import _ from 'lodash';

const SERVICES = 'pricing,reference,blotter,execution'.split(',');

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

    this.username = traders.code;
    this.connection = new autobahn.Connection({
      url,
      realm,
      use_es6_promises: true
    });

    this.queues = [];
    this.services = {};

    // stub session
    this.session = {
      log: (...args) => console.log(...args)
    };

    // register and subscribe to known services
    SERVICES.forEach((service) =>{
      this.services[service] = new ServiceDef(this);
      this.services[service].on('addInstance removeInstance', () => this.trigger('statusUpdate', this.getStatus()));
    });

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
    const ins     = instanceID + '.' + subscription.proc,
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
