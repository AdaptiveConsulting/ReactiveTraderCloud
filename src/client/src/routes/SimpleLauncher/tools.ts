import { ApplicationConfig } from './applicationConfigurations'
import { excelAdapter } from 'rt-components'

export async function open(
  config: ApplicationConfig,
): Promise<Window | fin.OpenFinWindow | fin.OpenFinApplication | void> {
  const { provider } = config

  // Not under openfin -> open as url on browser
  if (typeof fin === 'undefined') {
    return window.open(config.url, config.name)
  }

  // open as url through openfin
  if (provider.platformName === 'browser') {
    return new Promise((resolve, reject) =>
      fin.desktop.System.openUrlWithBrowser(config.url, resolve, reject),
    )
  }

  // open new openfin application
  if (provider.platformName === 'openfin') {
    switch (provider.applicationType) {
      case 'window':
        return createOpenFinWindow(config)
      case 'download':
        return launchLimitChecker(config)
      case 'excel':
        return excelAdapter.openExcel()
      case 'application':
      default:
        const app = await createOpenFinApplication(config)
        await new Promise((resolve, reject) => app.run(resolve, reject))
        return app
    }
  }
}

function createOpenFinApplication({
  name,
  url,
  provider: { windowOptions },
}: ApplicationConfig): Promise<fin.OpenFinApplication> {
  return new Promise((resolve, reject) => {
    const app: fin.OpenFinApplication = new fin.desktop.Application(
      {
        name,
        url,
        uuid: name,
        nonPersistent: true,
        mainWindowOptions: windowOptions,
      },
      () => resolve(app),
      e => reject(e),
    )
  })
}

function createOpenFinWindow({
  name,
  url,
  provider: { windowOptions },
}: ApplicationConfig): Promise<fin.OpenFinWindow> {
  return new Promise((resolve, reject) => {
    const window: fin.OpenFinWindow = new fin.desktop.Window(
      {
        url,
        name,
        ...windowOptions,
      },
      () => resolve(window),
      reject,
    )
  })
}

async function launchLimitChecker(config: ApplicationConfig) {
  const app = fin.desktop.Application.wrap(config.name)
  fin.desktop.System.launchExternalProcess({
    alias: 'LimitChecker',
    listener(result) {
      console.log('the exit code', result.exitCode)
    },
  })
  return app
}
