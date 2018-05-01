import { Observable, Subscription } from 'rxjs'
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

      let findServiceInstanceDisposable = new Subscription()

      disposables.add(findServiceInstanceDisposable)

      findServiceInstanceDisposable = source.subscribe(
        dictionary => {
          const serviceWithLeastLoad = dictionary
            .getValues()
            .sort(i => i.latestValue.serviceLoad)
            .find(i => i.latestValue.isConnected)

          if (serviceWithLeastLoad) {
            findServiceInstanceDisposable.unsubscribe()

            const serviceStatusStream = Observable.of(
              serviceWithLeastLoad.latestValue
            )
              .concat(serviceWithLeastLoad.stream)
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
