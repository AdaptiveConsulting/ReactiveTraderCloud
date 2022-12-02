import { fromEventPattern } from "rxjs"

export function topic$<T>(topic: Topic) {
  return fromEventPattern<T>(
    (handler) =>
      fin.InterApplicationBus.subscribe({ uuid: "*" }, topic, handler),
    (handler) =>
      fin.InterApplicationBus.unsubscribe({ uuid: "*" }, topic, handler),
  )
}

export function publish<T>(topic: Topic, message: T) {
  return fin.InterApplicationBus.publish(topic, message)
}

export enum Topic {
  TODO = "TODO",
}
