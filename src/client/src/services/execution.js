import rt from 'transport';
import traders from './../traders';

export default class Execution {

  static options = {
    event: 'execution.ExecuteTrade'
  }

  constructor(){
    this.transport = transport;
  }

  execute(payload, success, fail){
    const replyTo = event + (Math.random() * Math.pow(36, 8) << 0).toString(36);
    this.transport.session.call(Execution.options.event, [{
      ReplyTo: replyTo,
      Payload: payload,
      Trader: traders.code
    }]).then((response) => success(response), (error) => fail && fail(error));
  }
}
