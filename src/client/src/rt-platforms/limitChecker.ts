import { Observable } from 'rxjs'
import { getOpenFinPlatform } from './getPlatformAsync'

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
  }

  return new LimitCheckerImpl()
}
