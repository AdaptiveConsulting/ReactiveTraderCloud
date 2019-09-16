import { Observable } from 'rxjs'
import { WindowConfig, PlatformFeatures, PlatformType } from './types'
import { Context } from 'openfin-fdc3'
import DefaultRoute from './defaultRoute'
import Logo from './logo'
import { ApplicationEpic } from 'StoreTypes'

export interface LimitChecker {
  rpc(message?: object): Observable<boolean>
}

class LimitCheckerImpl implements LimitChecker {
  rpc() {
    return new Observable<boolean>(observer => {
      observer.next(true)
      observer.complete()
    })
  }
}

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

  limitChecker: LimitChecker

  notification: {
    notify: (message: object) => void
  }

  fdc3: {
    broadcast?: (context: Context) => void
  }

  style: {
    [key: string]: string | number
  }

  epics: Array<ApplicationEpic>

  Logo: React.FC

  PlatformHeader: React.FC<any>

  PlatformControls: React.FC<any>

  PlatformRoute: React.FC
}

export abstract class BasePlatformAdapter implements PlatformAdapterInterface {
  abstract readonly type: PlatformType

  abstract readonly allowTearOff: boolean

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

  limitChecker: LimitChecker = new LimitCheckerImpl()

  style = {
    height: '100%',
  }

  epics: Array<ApplicationEpic> = []

  PlatformHeader: React.FC<any> = () => null

  PlatformControls: React.FC<any> = () => null

  PlatformRoute: React.FC = DefaultRoute

  Logo: any = Logo
}
