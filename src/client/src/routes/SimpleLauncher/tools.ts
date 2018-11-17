import { ConfigType } from './config'

export async function open(config: ConfigType): Promise<Window | fin.OpenFinWindow | fin.OpenFinApplication | void> {
  const { provider } = config
  // under openfin
  if (typeof fin !== 'undefined') {
    // open as url through openfin
    if (provider.platform === 'browser') {
      return fin.desktop.System.openUrlWithBrowser(config.url)
    }
    // open new openfin application
    else if (provider.platform === 'openfin') {
      switch (provider.as) {
        case 'window':
          return createOpenFinWindow(config)
        case 'application':
        default: {
          const app = await createOpenFinApplication(config)

          await new Promise((resolve, reject) => app.run(resolve, reject))

          return app
        }
      }
    }
  }
  // open as url
  else {
    return window.open(config.url, config.name)
  }
}

export function createOpenFinApplication({
  name,
  url,
  provider: { options = {} as fin.WindowOptions | any },
}: ConfigType): Promise<fin.OpenFinApplication> {
  return new Promise((resolve, reject) => {
    const app: fin.OpenFinApplication = new fin.desktop.Application(
      {
        name,
        url,
        uuid: name,
        nonPersistent: false,
        mainWindowOptions: {
          ...options,
          defaultCentered: true,
          autoShow: true,
          shadow: true,
          // devtools
          accelerator:
            process.env.NODE_ENV === 'development'
              ? {
                  devtools: true,
                  zoom: true,
                  reload: true,
                  reloadIgnoreCache: true,
                }
              : {},
        },
        // improper OpenFin type definition
      } as any,
      () => resolve(app),
      e => {
        reject(e)
      },
    )
  })
}

export function createOpenFinWindow({ name, url, provider: { options } }: ConfigType): Promise<fin.OpenFinWindow> {
  return new Promise((resolve, reject) => {
    const window: fin.OpenFinWindow = new fin.desktop.Window(
      {
        url,
        name,
        uuid: name,
        ...options,
        defaultCentered: true,
        autoShow: true,
        shadow: true,
      } as any,
      () => resolve(window),
      reject,
    )
  })
}
