import { Observable } from 'rxjs'
import { WsConnection } from './WsConnection'
import { RxStompState } from '@stomp/rx-stomp'
import { map, tap } from 'rxjs/operators'
import logger from '../logger'

export function connectionStream$(broker: WsConnection): Observable<string> {
  return broker.streamEndpoint.connectionState$.pipe(
    tap(x => logger.info('', `Received response on topic status: ${x}`)),
    map(state => {
      // convert numeric RxStompState to string
      return RxStompState[state]
    }),
  )
}
