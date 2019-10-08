import { OpenFinLimitChecker } from './openFin/limitChecker/openFin'
import { Observable } from 'rxjs'

export interface LimitChecker {
  rpc(message?: object): Observable<boolean>
}

class LimitCheckerImpl implements LimitChecker {
  rpc() {
    return new Observable<boolean>(observer => {
      observer.next(true)
      observer.complete()
    })
  }
}

export const createLimitChecker = (platformName: string) => {
  if (platformName === 'openfin') {
    return new OpenFinLimitChecker()
  }

  return new LimitCheckerImpl()
}
