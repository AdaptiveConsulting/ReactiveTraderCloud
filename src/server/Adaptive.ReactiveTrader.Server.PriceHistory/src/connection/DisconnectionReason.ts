/**
 * @see https://github.com/crossbario/autobahn-js/blob/master/doc/reference.md
 */
export enum DisconnectionReason {
  /** The connection was closed explicitly (by the application or server). No automatic reconnection will be tried. */
  Closed = 'closed',

  /**
   * The connection had been formerly established at least once, but now was lost. Automatic reconnection
   * will happen unless you return truthy from this callback.
   */
  Lost = 'lost',

  /**
   * The connection could not be established in the first place. No automatic reattempt will happen,
   * since most often the cause is fatal (e.g.invalid server URL or server unreachable)
   */
  Unreachable = 'unreachable',

  /**
   * No WebSocket transport could be created. For security reasons the WebSocket spec states that there should not be any
   * specific errors for network-related issues, so no details are returned in this case either.
   */
  Unsupported = 'unsupported',
}
