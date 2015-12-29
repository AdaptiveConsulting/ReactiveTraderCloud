export default class ConnectionStatus {
  static get idle() : String {
    return 'idle';
  }

  static get connected() : String {
    return 'connected';
  }

  static get disconnected() : String {
    return 'disconnected';
  }

  static get sessionExpired() : String {
    return 'sessionExpired';
  }
}
