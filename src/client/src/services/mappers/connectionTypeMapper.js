import { ConnectionType } from '../model';

export default class ConnectionTypeMapper {
  _lookup:Object;

  constructor() {
    this._lookup = {
      'websocket': ConnectionType.WebSocket,
      'longpoll': ConnectionType.LongPolling
    };
  }
  
  map(type:string): ConnectionType {
    return this._lookup[type];
  };
}
