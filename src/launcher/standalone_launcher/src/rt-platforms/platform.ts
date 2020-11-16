import { AppConfig, PlatformType } from './types'
import { ApplicationEpic } from 'StoreTypes'
import { Observable } from 'rxjs'
import { PlatformWindow, PlatformWindowApi } from './platformWindow'

export interface PlatformFeatures {
  app: AppInterop
  interop: PubSubInterop
  share: (object: any) => void
  allowPopIn?: boolean
}

interface PubSubInterop {
  subscribe$: (topic: string) => Observable<any>
  publish: (topic: string, message: any) => void
}

interface AppInterop {
  open: (id: string, config: AppConfig) => Promise<string>
}

export type Platform = Partial<PlatformFeatures> & {
  readonly type: PlatformType

  readonly allowTearOff: boolean

  readonly name: string

  readonly window: PlatformWindowApi & PlatformWindow

  readonly notification: {
    notify: (message: object) => void
  }

  readonly style: {
    [key: string]: string | number
  }

  readonly epics: Array<ApplicationEpic>

  readonly Logo: React.FC

  readonly PlatformHeader: React.FC<any>

  readonly PlatformControls: React.FC<any>

  readonly PlatformFooter: React.FC<any>

  readonly PlatformRoute: React.FC<{ title?: string }>
}

/**
 * Determines whether a platform has a given feature and performs a type guard for it
 * @param platform
 * @param feature name of the feature
 */
export function platformHasFeature<FeatureName extends keyof PlatformFeatures>(
  platform: Platform,
  feature: FeatureName
): platform is Platform & Pick<PlatformFeatures, FeatureName> {
  return !!(platform as any)[feature]
}
