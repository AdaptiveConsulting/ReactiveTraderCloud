export const mapObject = <K extends string | number | symbol, I, O>(
  input: Record<K, I>,
  mapper: (i: I) => O,
): Record<K, O> =>
  Object.fromEntries(
    Object.entries(input).map(
      ([key, value]: any) => [key, mapper(value)] as const,
    ),
  ) as any
