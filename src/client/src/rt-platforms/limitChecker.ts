import { Observable } from 'rxjs'
import { getOpenFinPlatform } from './getPlatformAsync'
import { FinsembleLimitChecker } from './finsemble/limitChecker/openFin'

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

export const createLimitChecker = async (platformName: string) => {
  if (platformName === 'openfin') {
    const { OpenFinLimitChecker } = await getOpenFinPlatform()
    return new OpenFinLimitChecker()
  } else if (platformName === 'finsemble') {
    return new FinsembleLimitChecker()
  }

  return new LimitCheckerImpl()
}
