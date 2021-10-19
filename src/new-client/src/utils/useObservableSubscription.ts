import { useEffect } from "react"
import { Subscription } from "rxjs"

export const useObservableSubscription = (sub: Subscription) => {
  useEffect(() => {
    return () => {
      sub.unsubscribe()
    }
  }, [sub])
}
