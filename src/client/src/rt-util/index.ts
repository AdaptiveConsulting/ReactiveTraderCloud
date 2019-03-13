import { ActionCreatorsMapObject } from 'redux'
import { action, ActionUnion } from './ActionHelper'
import { RequireAtLeastOne, RequireOnlyOne, Extends, FunctionParams, LiteralUnion } from './utilityTypes'
export { action }
export { wait, getDeferredPromise } from './asyncUtils'
export { useMultiTimeout } from './hooks/useMultiTimeout'
export type ActionUnion<A extends ActionCreatorsMapObject> = ActionUnion<A>
export type Extends<T, U extends T> = Extends<T, U>
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = RequireAtLeastOne<T, Keys>
export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = RequireOnlyOne<T, Keys>

/**
 * Extract params from a function. Can be nested e.g. given a function
 *
 * `f(cb0: (arg: T0) => void, cb1: (arg: T1) => void) {...}`
 *
 * then T1 can be extracted:
 *
 * `FunctionParams<FunctionParams<typeof f>[1]>[0]`
 */
export type FunctionParams<T extends Function> = FunctionParams<T>

export type LiteralUnion<T extends U, U> = LiteralUnion<T, U>
