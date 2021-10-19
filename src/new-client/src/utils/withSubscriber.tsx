import { Subscribe } from "@react-rxjs/core"
import { ReactNode } from "react"
import { Loader } from "@/components/Loader"

export const withSubscriber = function <T>(
  Comp: React.ComponentType<T>,
  fallback?: NonNullable<ReactNode> | null,
) {
  return (props: T) => (
    <Subscribe fallback={fallback || <Loader />}>
      <Comp {...props} />
    </Subscribe>
  )
}
