import { ActionCreatorsMapObject } from 'redux'
import { PlatformWrapper, PlatformAdapter } from 'rt-platforms'
import { action, ActionUnion } from './ActionHelper'
import {
  RequireAtLeastOne,
  RequireOnlyOne,
  Extends,
  LiteralUnion,
  DeepPartial,
} from './utilityTypes'

export const getPlatform = (p: PlatformWrapper): PlatformAdapter => p && p.platform

export { action }
export { wait, getDeferredPromise } from './asyncUtils'
export { useForceUpdate } from './hooks/useForceUpdate'
export { useMultiTimeout } from './hooks/useMultiTimeout'
export { useWindowSize } from './hooks/useWindowSize'
export { waitForObject } from './waitForObject'
export type ActionUnion<A extends ActionCreatorsMapObject> = ActionUnion<A>
export type Extends<T, U extends T> = Extends<T, U>
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = RequireAtLeastOne<T, Keys>
export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = RequireOnlyOne<T, Keys>

export type LiteralUnion<T extends U, U> = LiteralUnion<T, U>

export type DeepPartial<T> = DeepPartial<T>
