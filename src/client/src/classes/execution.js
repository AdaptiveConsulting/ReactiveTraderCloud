import transport from '../utils/transport';
import traders from 'traders';

export default class Execution {

  static options = {
    event: 'execution.ExecuteTrade'
  }

  constructor(){
    this.transport = transport;
  }

  execute(payload){
    const replyTo = event + (Math.random() * Math.pow(36, 8) << 0).toString(36);
    this.transport.session.call(Execution.options.event, [{
      ReplyTo: replyTo,
      Payload: payload,
      Trader: traders.code
    }]).then((response) => {
      console.log(response);
    });
  }
}
