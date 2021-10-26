import { useEffect, useRef } from "react"
import { Subscription } from "rxjs"

export const useObservableSubscription = (sub: () => Subscription) => {
  const ref = useRef<Subscription>()

  useEffect(() => {
    if (!ref.current) {
      console.log("getting sub")
      ref.current = sub()
    }

    return () => {
      if (ref.current) {
        console.log("unsubscribing")
        ref.current.unsubscribe()
        ref.current = undefined
      }
    }
  }, [sub])
}
