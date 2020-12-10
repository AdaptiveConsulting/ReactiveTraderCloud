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

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) return false

  for (let i = 0; i < keysA.length; i++) {
    if (
      !Object.prototype.hasOwnProperty.call(objB, keysA[i]) ||
      !equals((objA as any)[keysA[i]], (objB as any)[keysA[i]])
    ) {
      return false
    }
  }

  return true
}
