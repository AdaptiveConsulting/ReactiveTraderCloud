import { WindowConfig, PlatformFeatures, PlatformType } from './types'
import { Context } from 'openfin-fdc3'
interface PlatformAdapterInterface {
  readonly type: PlatformType

  readonly allowTearOff: boolean
  
  readonly name: string

  window: {
    open: (config: WindowConfig, onClose?: () => void) => Promise<Window | null>
    close?: () => void
    maximize?: () => void
    minimize?: () => void
    resize?: () => void
  }

  notification: {
    notify: (message: object) => void
  }

  fdc3: {
    broadcast?: (context: Context) => void
  }
}

export abstract class BasePlatformAdapter implements PlatformAdapterInterface {
  abstract readonly type: PlatformType

  abstract readonly allowTearOff:boolean

  abstract readonly name: string
  /**
   * Determines whether a platform has a given feature and performs a type guard for it
   * @param feature name of the feature
   */
  hasFeature<FeatureName extends keyof PlatformFeatures>(
    feature: FeatureName,
  ): this is Pick<PlatformFeatures, FeatureName> {
    // ): this is PlatformFeatures[FeatureName] {
    return !!(this as any)[feature]
  }


  abstract window: {
    open: (config: WindowConfig, onClose?: () => void) => Promise<Window | null>
    close?: () => void
    maximize?: () => void
    minimize?: () => void
    resize?: () => void
  }
  abstract notification: {
    notify: (message: object) => void
  }
  abstract fdc3: {
    broadcast?: (context: Context) => void
  }
}
