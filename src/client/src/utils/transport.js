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
      console.log('connected');
      this.session = ws;
      this.discovery();
      this.trigger('open');
    };

    this.connection.onclose = () => {
      this.trigger('close');
    };

    this.services = {'pricing':{ subscriptions: [] }, 'reference':{ subscriptions: [] }, 'blotter':{ subscriptions: [] }};

    this.connection.open();
  }

  logHeartbeat(heartbeat) {
      heartbeat.Instance in this.services[heartbeat.Type] || ( this.services[heartbeat.Type][heartbeat.Instance] = {killer: _.debounce(()=>this.markAsDead(heartbeat.Type, heartbeat.Instance), 2000)});
      this.services[heartbeat.Type][heartbeat.Instance].killer();
      this.services[heartbeat.Type].subscriptions.forEach( sub=>{ if( !sub.called ) { sub.called = true; sub.instanceID = heartbeat.Instance; this.sessionRPC(sub, heartbeat.Instance); }});
  }

  discovery() {
    console.log('starting subscription');
    this.session.subscribe('status', (a) => this.logHeartbeat(a[0])).then(this.session.log, this.session.log);
    console.log('subscribed');
  }

  subscribe(event, callback, message = {}){
    const reply = _.uniqueId(event);

    this.session.subscribe(reply, (a) => callback(a[0])).then(this.session.log, this.session.log);
 
    if(event == 'reference.getCurrencyPairUpdatesStream') {
      this.services.reference.subscriptions.push({proc: 'getCurrencyPairUpdatesStream', message, reply, called: false});
      console.log('added subscription', this.services);
    }

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
    this.session.log(...args);
  }

  prefix(...args){
    this.session.prefix(...args);
  }

}

export default new Transport;
