import { Application } from 'openfin/_v2/main'

export interface ApplicationConfig {
  name: string
  url: string
  uuid?: string
  windowOptions?: OpenFinWindowOptions
}

export async function getExistingOpenFinApplication(
  uuid: string
): Promise<Application | undefined> {
  const allApps = await fin.System.getAllApplications()
  const targetApp = allApps.some(app => app.uuid === uuid)
  if (targetApp) {
    return fin.Application.wrap({ uuid })
  }
}

async function restoreExistingApp(existingApp: Application): Promise<void> {
  const isRunning = await existingApp.isRunning()
  if (!isRunning) {
    await existingApp.run()
    return
  }

  const window = await existingApp.getWindow()
  await window.restore()
  await window.bringToFront()
}

export async function createOrBringToFrontOpenFinApplication({
  name,
  url,
  uuid,
  windowOptions,
}: ApplicationConfig): Promise<Application> {
  const existingApp = await getExistingOpenFinApplication(name)
  if (existingApp) {
    await restoreExistingApp(existingApp)
    return existingApp
  }
  return createAndRunOpenFinApplication({ name, url, uuid, windowOptions })
}

export async function createAndRunOpenFinApplication({
  name,
  url,
  uuid,
  windowOptions,
}: ApplicationConfig): Promise<Application> {
  const appOptions: fin.ApplicationOption = {
    name,
    url,
    uuid: uuid || name,
    nonPersistent: true,
    mainWindowOptions: windowOptions,
    fdc3Api: true,
  }

  return fin.Application.start(appOptions)
}

export function createOpenFinWindow({
  name,
  url,
  windowOptions,
}: ApplicationConfig): Promise<fin.OpenFinWindow> {
  return new Promise((resolve, reject) => {
    const window: fin.OpenFinWindow = new fin.desktop.Window(
      {
        url,
        name,
        ...windowOptions,
      },
      () => resolve(window),
      reject
    )
  })
}

/**
 * Gets the title of the first `content` element of the current Platform Layout
 */
export async function getPlatformLayoutTitle(): Promise<string | undefined> {
  const layout = fin.Platform.Layout.getCurrentSync()
  const config = await layout.getConfig()
  return config.content?.[0].title
}
