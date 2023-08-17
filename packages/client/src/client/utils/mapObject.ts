export function mapObject<K extends string | number | symbol, I, O>(
  input: Record<K, I>,
  mapper: (i: I, k: K) => O,
): Record<K, O>

export function mapObject<K extends string | number | symbol, I, O>(
  input: Record<K, I>,
  mapper: (i: I, k?: K) => O,
): Record<K, O> {
  return Object.fromEntries(
    Object.entries(input).map(([key, value]: [string, unknown]) => [
      key,
      mapper(value as I, key as K),
    ]),
  ) as Record<K, O>
}
