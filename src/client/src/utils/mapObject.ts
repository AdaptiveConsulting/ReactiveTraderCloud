export function mapObject<K extends string | number | symbol, I, O>(
  input: Record<K, I>,
  mapper: (i: I, k: K) => O,
): Record<K, O>

export function mapObject<K extends string | number | symbol, I, O>(
  input: Record<K, I>,
  mapper: (i: I, k?: K) => O,
): Record<K, O> {
  return Object.fromEntries(
    Object.entries(input).map(
      ([key, value]: any) => [key, mapper(value, key)] as const,
    ),
  ) as any
}
