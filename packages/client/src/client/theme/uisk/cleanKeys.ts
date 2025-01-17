export function cleanKeys(object: Record<string, number>, string: string) {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [
      key.replace(`${string}-`, "").replace(`-${string}`, ""),
      value,
    ]),
  )
}
