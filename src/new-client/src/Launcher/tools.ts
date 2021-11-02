// TODO - Revisit if/when launcher is cross platform
import {
  ApplicationConfig,
  ApplicationProvider,
} from "./applicationConfigurations"
import {
  createOpenFinWindow,
  bringToFrontOpenFinApplication,
  createAndRunOpenFinApplication,
} from "./utils"
import { Application } from "openfin/_v2/main"

function openWindow(provider: ApplicationProvider, name: string, url?: string) {
  if (!provider.windowOptions) {
    console.error(`Error opening app - windowOptions object is missing`)
    return
  }
  if (typeof url === "undefined") {
    console.error(`Error opening app - url is missing`)
    return
  }
  return createOpenFinWindow(name, url, provider.windowOptions)
}

async function openApplication({
  name,
  url,
  uuid,
  provider,
}: ApplicationConfig) {
  if (!provider?.windowOptions) {
    console.error(`Error opening app - windowOptions object is missing`)
    return
  }
  if (typeof url === "undefined") {
    console.error(`Error opening app - url is missing`)
    return
  }
  const runningApp = await bringToFrontOpenFinApplication(uuid ?? name)
  if (runningApp) {
    return runningApp
  }
  return createAndRunOpenFinApplication(name, url, uuid, provider.windowOptions)
}

async function launchByManifestUrl(uuid: string, manifestUrl?: string) {
  if (typeof manifestUrl === "undefined") {
    console.error(`Error opening app by manifest - url is missing`)
    return
  }
  const runningApp = await bringToFrontOpenFinApplication(uuid)
  if (runningApp) {
    return runningApp
  }
  return fin.Application.startFromManifest(manifestUrl)
}

export async function open(
  config: ApplicationConfig,
): Promise<Window | fin.OpenFinWindow | Application | void | null> {
  const { provider, url, name, uuid } = config

  // Not under openfin -> open as url on browser
  if (typeof fin === "undefined") {
    return window.open(config.url, config.name)
  }

  // open as url through openfin
  if (provider?.platformName === "browser") {
    return new Promise((resolve, reject) => {
      if (typeof config.url !== "string") {
        console.error(`Error opening with browser - url should be a string`)
        return
      }
      fin.desktop.System.openUrlWithBrowser(config.url, resolve, reject)
    })
  }

  // open new openfin application
  if (provider?.platformName === "openfin") {
    switch (provider.applicationType) {
      case "window":
        return openWindow(provider, name, url)
      case "download":
        return launchLimitChecker(config)
      case "application":
        return openApplication(config)
      case "manifest":
        return launchByManifestUrl(uuid ?? name, url)
      default:
        throw new Error(`Unknown applicationType: ${provider.applicationType}`)
    }
  }
}

async function launchLimitChecker(config: ApplicationConfig) {
  const app = fin.Application.wrap({ uuid: config.name })
  fin.desktop.System.launchExternalProcess(
    {
      alias: "LimitChecker",
      listener: (result) => {
        console.log("the exit code", result.exitCode)
      },
    },
    (data) => {
      console.info("Process launched: ", data)
    },
    (e) => {
      console.error("Process launch failed: ", e)
    },
  )
  return app
}
