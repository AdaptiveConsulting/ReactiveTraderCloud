import { Observable } from "rxjs"
import { checkLimitFn } from "./types"

export const checkLimit$: checkLimitFn = () =>
  new Observable<boolean>((observer) => {
    observer.next(true)
    observer.complete()
  })
