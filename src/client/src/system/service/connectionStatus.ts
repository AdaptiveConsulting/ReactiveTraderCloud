export default class ConnectionStatus {
  static get idle(): string {
    return 'idle';
  }

  static get connected(): string {
    return 'connected';
  }

  static get disconnected(): string {
    return 'disconnected';
  }

  static get sessionExpired(): string {
    return 'sessionExpired';
  }
}
