import { bind, SUSPENSE } from "@react-rxjs/core"
import { Observable } from "rxjs"
import { map } from "rxjs/operators"

export const createSuspenseOnStale = (
  source$: Observable<boolean>,
): React.FC => {
  const [useSuspenseOnStale] = bind(
    source$.pipe(map((isStale) => (isStale ? SUSPENSE : null))),
  )
  return () => useSuspenseOnStale()
}
