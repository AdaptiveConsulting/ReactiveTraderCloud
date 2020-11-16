export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  { [K in Keys]-?: Required<Pick<T, K>> }[Keys]

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  { [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>> }[Keys]

export type Extends<T, U extends T> = U

// Workaround to get intellisense on type unions of 'literals' | string.
// See https://github.com/Microsoft/TypeScript/issues/29729
export type LiteralUnion<T extends U, U = string> = T | (U & { zz_IGNORE_ME?: never })

// Like Partial<T> but recursively for deep objects. Extracted from redux types
export type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> }

// extracts the return type of a promise, or a function that returns a promise
// see https://stackoverflow.com/questions/48011353/how-to-unwrap-type-of-a-promise?rq=1
export type AsyncReturnType<T> = T extends Promise<infer U>
  ? U
  : T extends (...args: any[]) => Promise<infer V>
  ? V
  : T
