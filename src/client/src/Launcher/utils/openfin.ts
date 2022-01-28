// TODO - Revisit if/when launcher is cross platform
import { Application } from "openfin/_v2/main"
import { Bounds } from "openfin/_v2/shapes/shapes"
import { useEffect } from "react"

export async function getExistingOpenFinApplication(
  uuid: string,
): Promise<Application | undefined> {
  const allApps = await fin.System.getAllApplications()
  const targetApp = allApps.some((app) => app.uuid === uuid)
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

export async function bringToFrontOpenFinApplication(
  uuid: string,
): Promise<Application | undefined> {
  const existingApp = await getExistingOpenFinApplication(uuid)
  if (existingApp) {
    await restoreExistingApp(existingApp)
    return existingApp
  }
}

export async function createAndRunOpenFinApplication(
  name: string,
  url: string,
  uuid?: string,
  windowOptions?: fin.WindowOption,
): Promise<Application> {
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

export function createOpenFinWindow(
  name: string,
  url: string,
  windowOptions?: fin.WindowOption,
): Promise<fin.OpenFinWindow> {
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

export const minimiseCurrentWindow = async () => {
  const window = await fin.Window.getCurrent()
  window.minimize()
}

export const getCurrentWindowBounds = async () => {
  const window = await fin.Window.getCurrent()
  return window.getBounds()
}

export async function animateCurrentWindowSize(
  bounds: Bounds,
  duration: number = 200,
) {
  const window = await fin.Window.getCurrent()

  return window.animate(
    {
      size: {
        duration,
        height: bounds.height,
        width: bounds.width,
      },
    },
    {
      tween: "ease-in-out",
      interrupt: true,
    },
  )
}

export function useAppBoundReset(bounds: Bounds | undefined) {
  useEffect(() => {
    if (!bounds) {
      return
    }

    const resetAppBound = () => {
      animateCurrentWindowSize({
        ...bounds,
      })
    }

    window.addEventListener("beforeunload", resetAppBound)

    return () => {
      window.removeEventListener("beforeunload", resetAppBound)
    }
  }, [bounds])
}
