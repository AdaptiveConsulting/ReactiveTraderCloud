export function wait(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

export async function mapAsync<TIn, TOut>(
  items: TIn[],
  mapper: (item: TIn, index?: number) => Promise<TOut>,
): Promise<TOut[]> {
  const results: TOut[] = []

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const result = await mapper(item, i)
    results.push(result)
  }

  return results
}

export async function findAsync<T>(items: T[], predicate: (item: T, index?: number) => Promise<boolean>): Promise<T> {
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const matches = await predicate(item, i)

    if (matches) {
      return item
    }
  }

  return void 0
}
