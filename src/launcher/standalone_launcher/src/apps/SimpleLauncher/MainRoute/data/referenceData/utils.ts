// TODO: revisit
export function toObject<T>(aMap: Map<string, T>): { [id: string]: T } {
  const obj = {}
  aMap.forEach((v, k) => {
    obj[k] = v
  })
  return obj
}
