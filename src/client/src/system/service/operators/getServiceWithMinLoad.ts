import { Observable, of as observableOf, Subscription } from 'rxjs'

import { concat } from 'rxjs/operators'
import { ServiceInstanceStatus } from '../../../types'
import LastValueObservableDictionary from './../lastValueObservableDictionary'

export function getServiceWithMinLoad(
  waitForServiceIfNoneAvailable = true
): (
  source: Observable<LastValueObservableDictionary<ServiceInstanceStatus>>
) => Observable<ServiceInstanceStatus> {
  return source =>
    new Observable(obs => {
      const disposables = new Subscription()

      const findServiceInstanceDisposable = source.subscribe(
        dictionary => {
          const serviceWithLeastLoad = dictionary
            .getValues()
            .sort(i => i.latestValue.serviceLoad)
            .find(i => i.latestValue.isConnected)

          if (serviceWithLeastLoad) {
            if (findServiceInstanceDisposable) {
              findServiceInstanceDisposable.unsubscribe()
            }

            const serviceStatusStream = observableOf(
              serviceWithLeastLoad.latestValue
            )
              .pipe(concat(serviceWithLeastLoad.stream))
              .subscribe(obs)

            disposables.add(serviceStatusStream)
          } else if (!waitForServiceIfNoneAvailable) {
            obs.error(new Error('No service available'))
          }
        },
        ex => {
          obs.error(ex)
        }
      )
      return disposables
    })
}
