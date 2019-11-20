/* eslint-disable no-undef */
import {ApplicationConfig, ApplicationProvider} from './applicationConfigurations'
import {createExcelApp} from 'rt-platforms'
import {createOpenFinWindow, createOrBringToFrontOpenFinApplication} from '../utils'
import {Application} from 'openfin/_v2/main'

function openWindow(provider: ApplicationProvider, name: string, url?: string) {
  if (!provider.windowOptions) {
    console.error(`Error opening app - windowOptions object is missing`)
    return
  }
  if (typeof url === 'undefined') {
    console.error(`Error opening app - url is missing`)
    return
  }
  return createOpenFinWindow({name, url, windowOptions: provider.windowOptions})
}

function handleApplication(provider: ApplicationProvider, name: string, url?: string) {
  if (!provider.windowOptions) {
    console.error(`Error opening app - windowOptions object is missing`)
    return
  }
  if (typeof url === 'undefined') {
    console.error(`Error opening app - url is missing`)
    return
  }
  return createOrBringToFrontOpenFinApplication({
    name,
    url,
    windowOptions: provider.windowOptions,
  })
}

export async function open(
  config: ApplicationConfig,
): Promise<Window | fin.OpenFinWindow | Application | void | null> {
  const {provider, url, name} = config

  // Not under openfin -> open as url on browser
  if (typeof fin === 'undefined') {
    return window.open(config.url, config.name)
  }

  // open as url through openfin
  if (provider && provider.platformName === 'browser') {
    return new Promise((resolve, reject) => {
      if (typeof config.url !== 'string') {
        console.error(`Error opening with browser - url should be a string`)
        return
      }
      fin.desktop.System.openUrlWithBrowser(config.url, resolve, reject)
    })
  }

  // open new openfin application
  if (provider && provider.platformName === 'openfin') {
    switch (provider.applicationType) {
      case 'window':
        return openWindow(provider, name, url)
      case 'download':
        return launchLimitChecker(config)
      case 'excel':
        const excelApp = await createExcelApp(provider.platformName)
        return excelApp.open()
      case 'application':
      default:
        return handleApplication(provider, name, url)
    }
  }
}

async function launchLimitChecker(config: ApplicationConfig) {
  const app = fin.Application.wrap({uuid: config.name})
  fin.desktop.System.launchExternalProcess(
    {
      alias: 'LimitChecker',
      listener: result => {
        console.log('the exit code', result.exitCode)
      },
    },
    (data) => {
      console.info('Process launched: ' + data)
    },
    (e) => {
      console.error('Process launch failed: ' + e)
    })
  return app
}
