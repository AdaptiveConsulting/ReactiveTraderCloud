import autobahn from 'autobahn';

class Transport {

  constructor(url = 'ws://localhost:9000', realm = 'ReactiveTrader'){
    this.connection = autobahn.Connection({
      url,
      realm,
      use_es6_promises: true
    });

    this.session = {
      subscriptions: []
    };

    this.connection.onopen = (ws) => {
      this.session = ws;
    };

    this.connection.onclose = () => {

    };
  }

  on(event, callback, options){
    return this.session.subscribe(event, callback, options);
  }

  off(...args){
    return this.session.unsubscribe(...args);
  }

  emit(...args){
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

export default Transport;
