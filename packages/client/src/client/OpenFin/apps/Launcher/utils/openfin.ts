import OpenFin from "@openfin/core"
import { useEffect } from "react"

export const closePlatform = () => {
  fin.Platform.getCurrentSync().quit()
}

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
  const window = await existingApp.getWindow()
  await window.restore()
  await window.bringToFront()
}

export async function bringToFrontOpenFinApplication(
  uuid: string,
): Promise<OpenFin.Application | undefined> {
  const existingApp = await getExistingOpenFinApplication(uuid)

  // If the app is not running then just continue and let the rest of the steps start up the app
  if (!existingApp || !(await existingApp.isRunning())) return

  await restoreExistingApp(existingApp)
  return existingApp
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
  bounds: OpenFin.Bounds,
  duration = 200,
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

export function useAppBoundReset(bounds: OpenFin.Bounds | undefined) {
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
