import { fromEventPattern } from "rxjs"

export function topic$<T>(topic: Topic) {
  return fromEventPattern<T>(
    (handler) =>
      fin.InterApplicationBus.subscribe({ uuid: "*" }, topic, handler),
    (handler) =>
      fin.InterApplicationBus.unsubscribe({ uuid: "*" }, topic, handler),
  )
}

// TODO (5465) - use it or lose it
// .. this feels like the centralising place I was looking for, tho, to tie up
// interop functions, channel defaults etc.
// see also notifications, and Credit "View Trade" messages ..
export function publish<T>(topic: Topic, message: T) {
  return fin.InterApplicationBus.publish(topic, message)
}

export enum Topic {
  TODO = "TODO",
}
