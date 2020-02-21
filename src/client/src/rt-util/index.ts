import { ActionCreatorsMapObject } from 'redux'
import * as actionHelper from './ActionHelper'
import * as utilityTypes from './utilityTypes'
export const { action } = actionHelper
export { wait, getDeferredPromise } from './asyncUtils'
export { useForceUpdate } from './hooks/useForceUpdate'
export { useMultiTimeout } from './hooks/useMultiTimeout'
export { useWindowSize } from './hooks/useWindowSize'
export { waitForObject } from './waitForObject'
export { getEnvironment } from './getEnvironment'
export type ActionUnion<A extends ActionCreatorsMapObject> = actionHelper.ActionUnion<A>
export type Extends<T, U extends T> = utilityTypes.Extends<T, U>
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = utilityTypes.RequireAtLeastOne<
  T,
  Keys
>
export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = utilityTypes.RequireOnlyOne<T, Keys>

export type LiteralUnion<T extends U, U> = utilityTypes.LiteralUnion<T, U>

export type DeepPartial<T> = utilityTypes.DeepPartial<T>
