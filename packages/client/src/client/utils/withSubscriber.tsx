import { Subscribe } from "@react-rxjs/core"
import { Loader } from "client/components/Loader"
import { ReactNode } from "react"

export const withSubscriber = function <T extends object>(
  Comp: React.ComponentType<T>,
  fallback?: NonNullable<ReactNode> | null,
) {
  return function WithSubscriber(props: T) {
    return (
      <Subscribe fallback={fallback || <Loader />}>
        <Comp {...props} />
      </Subscribe>
    )
  }
}
