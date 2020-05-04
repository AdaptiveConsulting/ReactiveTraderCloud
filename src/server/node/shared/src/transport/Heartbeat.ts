import { interval, Subscription } from 'rxjs'
import { WsConnection } from './WsConnection'
import { RxStompState } from '@stomp/rx-stomp'

export class Heartbeat {
  private broker: WsConnection
  private service: string
  private hostInstance: string
  private state: RxStompState = RxStompState.CLOSED
  private heartbeat$: Subscription = Subscription.EMPTY

  constructor(broker: WsConnection, service: string, hostInstance: string) {
    this.broker = broker
    this.service = service
    this.hostInstance = hostInstance
  }

  private publishStatus(): void {
    const status = {
      Type: this.service,
      Load: this.state == 1 ? this.state : 0,
      TimeStamp: Date.now(),
      Instance: this.hostInstance,
    }
    this.broker.streamEndpoint.publish({
      destination: '/exchange/status',
      body: JSON.stringify(status),
    })
  }

  StartHeartbeat(): void {
    this.broker.streamEndpoint.connectionState$.subscribe(state => {
      this.state = state
      if (state == RxStompState.CLOSED) {
        this.publishStatus()
        this.heartbeat$.unsubscribe()
      } else if (state == RxStompState.OPEN) {
        this.heartbeat$ = this.heartbeat()
      }
    })
  }

  private heartbeat(): Subscription {
    const HEARTBEAT_INTERVAL_MS = 1000
    const source = interval(HEARTBEAT_INTERVAL_MS)
    return source.subscribe(() => this.publishStatus())
  }
}
