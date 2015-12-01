import emitter from '../emitter';

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
      this.instances[instance] = this.createNewInstance(instance, load);
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

    while (this.pendingSubscriptions.length){
      const p = this.pendingSubscriptions.shift();
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

    return new Promise((resolve, reject) =>{

      if (!pickedInstanceID){
        return reject(new Error('No instance for ' + proc));
      }
      this.transport.remoteCall(subscription, pickedInstanceID).then(resolve, reject);

    });
  }
}

export default ServiceDef;
