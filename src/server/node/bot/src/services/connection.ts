import { connectionStatus$, ConnectionStatus } from '@adaptive/hydra-platform'
import { EMPTY, Observable } from 'rxjs'
import { switchMap } from 'rxjs/operators'

export const withConnection = () => <T>(source$: Observable<T>) =>
  connectionStatus$().pipe(
    switchMap(connection => (connection === ConnectionStatus.CONNECTED ? source$ : EMPTY))
  )
