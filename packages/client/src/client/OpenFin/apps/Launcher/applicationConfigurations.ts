import OpenFin from "@openfin/core"

import { ENVIRONMENT, manifestUrls } from "@/client/constants"

import {
  limitCheckerIcon,
  reactiveTraderCreditIcon,
  reactiveTraderFxIcon,
} from "./icons"

type PlatformName = "browser" | "openfin" | "finsemble"

type ApplicationType =
  | "window"
  | "download"
  | "application"
  | "manifest"
  | "excel"

export interface ApplicationProvider {
  platformName: PlatformName
  applicationType: ApplicationType
  windowOptions?: OpenFin.WindowCreationOptions
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
const envSuffix = `(${ENVIRONMENT.toUpperCase()})`

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
    url: manifestUrls.reactiveTrader,
    icon: reactiveTraderFxIcon,
  },
  {
    ...baseConfig(),
    name: `Reactive Trader® Credit${envSuffix}`,
    displayName: "RT Credit",
    tooltipName: `Launch Reactive Trader® Credit${envSuffix}`,
    uuid: `reactive-trader-credit-${env}`,
    url: manifestUrls.reactiveCredit,
    icon: reactiveTraderCreditIcon,
  },
  {
    ...baseConfig(),
    name: "Limit Checker",
    displayName: "LC",
    tooltipName: "Launch Limit Checker",
    uuid: "limit-checker",
    url: manifestUrls.limitChecker,
    icon: limitCheckerIcon,
  },
]

export const appConfigs = baseAppConfigs
