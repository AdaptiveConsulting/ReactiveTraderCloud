import { Observable } from "rxjs"

import { CheckLimitStreamGenerator } from "./types"

export const checkLimit$: CheckLimitStreamGenerator = () =>
  new Observable<boolean>((observer) => {
    observer.next(true)
    observer.complete()
  })

export const useIsLimitCheckerRunning = () => false
