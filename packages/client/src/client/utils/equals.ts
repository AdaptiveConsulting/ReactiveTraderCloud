export function equals<T>(objA: T, objB: T): boolean {
  if (Object.is(objA, objB)) return true

  if (
    typeof objA !== "object" ||
    objA === null ||
    typeof objB !== "object" ||
    objB === null
  ) {
    return false
  }

  const keysA = Object.keys(objA) as (keyof T)[]
  const keysB = Object.keys(objB) as (keyof T)[]

  if (keysA.length !== keysB.length) return false

  for (let i = 0; i < keysA.length; i++) {
    if (
      !Object.prototype.hasOwnProperty.call(objB, keysA[i]) ||
      !equals(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false
    }
  }

  return true
}
