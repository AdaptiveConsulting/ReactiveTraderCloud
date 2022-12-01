// TODO - Revisit if/when launcher is cross platform
import { Bounds } from "openfin/_v2/shapes/shapes"
import { useEffect } from "react"

export async function getExistingOpenFinApplication(
  uuid: string,
): Promise<OpenFin.Application | undefined> {
  const allApps = await fin.System.getAllApplications()
  const targetApp = allApps.some((app) => app.uuid === uuid)
  if (targetApp) {
    return fin.Application.wrap({ uuid })
  }
}

async function restoreExistingApp(
  existingApp: OpenFin.Application,
): Promise<void> {
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
): Promise<OpenFin.Application | undefined> {
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
  windowOptions?: OpenFin.WindowCreationOptions,
): Promise<OpenFin.Application> {
  return fin.Application.start({
    name,
    url,
    uuid: uuid || name,
    nonPersistent: true,
    mainWindowOptions: windowOptions,
    // TODO understand if we need to pass this property, if not, remove it
    // @ts-ignore
    fdc3Api: true,
  })
}

function createOpenFinWindow(
  name: string,
  url: string,
  windowOptions?: OpenFin.WindowCreationOptions,
): Promise<OpenFin.Window> {
  return new Promise((resolve, reject) => {
    const window = fin.Window.create({
      url,
      name,
      ...windowOptions,
    })
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

export async function animateCurrentWindowSize(bounds: Bounds, duration = 200) {
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
