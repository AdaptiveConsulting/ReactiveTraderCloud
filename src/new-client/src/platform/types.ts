import { Observable } from "rxjs"

export type PlatformType = "web" | "openfin" | "finsemble"

// TODO - Revisit when we implement OpenFin and Finsemble platforms
// This was the minimum needed to be able to differentiate platform in child components
export type Platform = {
  type: PlatformType
}

export type PlatformMocked = {
  type: PlatformType
  name: string
}

export interface PlatformFeatures {
  // app: AppInterop
  interop: PubSubInterop
  share: (object: any) => void
  allowPopIn?: boolean
}

interface PubSubInterop {
  subscribe$: (topic: string) => Observable<any>
  publish: (topic: string, message: any) => void
}

// interface AppInterop {
//   open: (id: string, config: AppConfig) => Promise<string>
// }

export function platformHasFeature<FeatureName extends keyof PlatformFeatures>(
  platform: Platform,
  feature: FeatureName,
): platform is Platform & Pick<PlatformFeatures, FeatureName> {
  return !!(platform as any)[feature]
}
