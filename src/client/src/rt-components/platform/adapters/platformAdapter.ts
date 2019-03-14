import { WindowConfig, PlatformFeatures, PlatformName, PlatformType } from './types'

interface PlatformAdapterInterface {
  readonly name: PlatformName
  readonly type: PlatformType

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

}

export abstract class BasePlatformAdapter implements PlatformAdapterInterface {
  abstract readonly name: PlatformName
  abstract readonly type: PlatformType

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
    open: (config: WindowConfig, onClose?: () => void) => Promise<Window>
    close?: () => void
    maximize?: () => void
    minimize?: () => void
    resize?: () => void
  }
  abstract notification: {
    notify: (message: object) => void
  }
}
