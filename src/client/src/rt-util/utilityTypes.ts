export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  { [K in Keys]-?: Required<Pick<T, K>> }[Keys]

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  { [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>> }[Keys]

export type Extends<T, U extends T> = U

// Workaround to get intellisense on type unions of 'literals' | string. 
// See https://github.com/Microsoft/TypeScript/issues/29729
export type LiteralUnion<T extends U, U = string> = T | (U & {zz_IGNORE_ME?: never })
