import { ENVIRONMENT } from "@/constants"
import { constructUrl } from "@/utils/url"
import {
  limitCheckerIcon,
  reactiveAnalyticsIcon,
  reactiveTraderIcon,
} from "./icons"
import { getReactiveTraderUrl } from "./utils/url"

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
const reactiveTraderManifestUrl = getReactiveTraderUrl(
  `${isLocal ? "/dist" : ""}/config/app.json`,
)
const reactiveAnalyticsManifestUrl = isLocal
  ? "http://localhost:3005/openfin/app.json"
  : // TODO
    "https://demo-reactive-analytics.adaptivecluster.com/openfin/app.json"

const baseAppConfigs: ApplicationConfig[] = [
  {
    name: `Reactive Trader®${envSuffix}`,
    displayName: "RT",
    tooltipName: `Launch Reactive Trader®${envSuffix}`,
    uuid: `reactive-trader-${env}`,
    url: reactiveTraderManifestUrl,
    icon: reactiveTraderIcon,
    iconFillColor: "#CFCFCF",
    iconHoverFillColor: "#ffffff",
    iconHoverBackgroundColor: "#28588d",
    provider: {
      platformName: "openfin",
      applicationType: "manifest",
    },
  },
  {
    name: `Reactive Analytics${envSuffix}`,
    displayName: "RA",
    tooltipName: `Launch Reactive Analytics${envSuffix}`,
    uuid: `reactive-analytics-${env}`,
    url: reactiveAnalyticsManifestUrl,
    icon: reactiveAnalyticsIcon,
    iconFillColor: "#CFCFCF",
    iconHoverFillColor: "#ffffff",
    iconHoverBackgroundColor: "#AAABD1",
    provider: {
      platformName: "openfin",
      applicationType: "manifest",
    },
  },
  {
    name: "Limit Checker",
    displayName: "LC",
    tooltipName: "Launch Limit Checker",
    icon: limitCheckerIcon,
    iconFillColor: "#CFCFCF",
    iconHoverFillColor: "#ffffff",
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
