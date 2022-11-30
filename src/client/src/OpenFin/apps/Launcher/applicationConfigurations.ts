import { ENVIRONMENT } from "@/constants"
import { constructUrl } from "@/utils/url"
import {
  limitCheckerIcon,
  reactiveAnalyticsIcon,
  reactiveTraderCreditIcon,
  reactiveTraderFxIcon,
} from "./icons"
import { getReactiveAnalyticsUrls, getReactiveTraderUrl } from "./utils/url"

type PlatformName = "browser" | "openfin" | "finsemble"

const defaultWindowOptions: fin.WindowOption = {
  autoShow: true,
  defaultWidth: 1280,
  defaultHeight: 900,
  minWidth: 800,
  minHeight: 600,
  resizable: true,
  maximizable: true,
  defaultCentered: true,
  frame: false,
  shadow: true,
  icon: constructUrl(`/static/media/adaptive.ico`),
  accelerator:
    process.env.NODE_ENV !== "development"
      ? {}
      : {
          devtools: true,
          reload: true,
          reloadIgnoringCache: true,
          zoom: true,
        },
}

type ApplicationType =
  | "window"
  | "download"
  | "application"
  | "manifest"
  | "excel"

export interface ApplicationProvider {
  platformName: PlatformName
  applicationType: ApplicationType
  windowOptions?: fin.WindowOption
}

export interface ApplicationConfig {
  name: string
  displayName: string
  tooltipName?: string
  uuid?: string
  url?: string
  icon: JSX.Element
  iconFillColor: string
  iconHoverFillColor?: string
  iconHoverBackgroundColor?: string
  provider?: ApplicationProvider
}

const env = ENVIRONMENT
const isLocal = env === "local"
const envSuffix = `(${ENVIRONMENT.toUpperCase()})`
const reactiveTraderFxManifestUrl = getReactiveTraderUrl(
  `${isLocal ? "/dist" : ""}/config/rt-fx.json`,
)
const reactiveTraderCreditManifestUrl = getReactiveTraderUrl(
  `${isLocal ? "/dist" : ""}/config/rt-credit.json`,
)
const reactiveAnalyticsManifestUrl = getReactiveAnalyticsUrls(env)

const baseConfig = () => ({
  iconFillColor: "#CFCFCF",
  iconHoverFillColor: "#ffffff",
  iconHoverBackgroundColor: "#28588d",
  provider: {
    platformName: "openfin",
    applicationType: "manifest",
  } as ApplicationProvider,
})

const baseAppConfigs: ApplicationConfig[] = [
  {
    ...baseConfig(),
    name: `Reactive Trader®${envSuffix}`,
    displayName: "RT FX",
    tooltipName: `Launch Reactive Trader®${envSuffix}`,
    uuid: `reactive-trader-${env}`,
    url: reactiveTraderFxManifestUrl,
    icon: reactiveTraderFxIcon,
  },
  {
    ...baseConfig(),
    name: `Reactive Trader® Credit${envSuffix}`,
    displayName: "RT Credit",
    tooltipName: `Launch Reactive Trader® Credit${envSuffix}`,
    uuid: `reactive-trader-credit-${env}`,
    url: reactiveTraderCreditManifestUrl,
    icon: reactiveTraderCreditIcon,
  },
  {
    ...baseConfig(),
    name: `Reactive Analytics${envSuffix}`,
    displayName: "RA",
    tooltipName: `Launch Reactive Analytics${envSuffix}`,
    uuid: `reactive-analytics-${env}`,
    url: reactiveAnalyticsManifestUrl,
    icon: reactiveAnalyticsIcon,
    iconHoverBackgroundColor: "#AAABD1",
  },
  {
    ...baseConfig(),
    name: "Limit Checker",
    displayName: "LC",
    tooltipName: "Launch Limit Checker",
    icon: limitCheckerIcon,
    provider: {
      platformName: "openfin",
      applicationType: "download",
      windowOptions: {
        ...defaultWindowOptions,
        icon: constructUrl(`/static/media/limit-checker-icon.ico`),
      },
    },
  },
]

export const appConfigs = baseAppConfigs
