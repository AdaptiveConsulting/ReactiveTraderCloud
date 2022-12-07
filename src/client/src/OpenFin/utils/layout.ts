import queryString from "query-string"
import { useLocation } from "react-router-dom"
import { mainOpenFinWindowName } from "./window"

export const isLayoutLocked = async (): Promise<boolean> => {
  const { settings } = await fin.Platform.Layout.getCurrentSync().getConfig()

  return Boolean(settings && !settings.hasHeaders && !settings.reorderEnabled)
}

export const toggleLayoutLock = async () => {
  const layout = fin.Platform.Layout.wrapSync({
    name: mainOpenFinWindowName,
    uuid: fin.me.uuid,
  })

  const oldLayout = await layout.getConfig()
  const { settings, dimensions } = oldLayout
  if (settings && settings.hasHeaders && settings.reorderEnabled) {
    layout.replace({
      ...oldLayout,
      settings: {
        ...settings,
        hasHeaders: false,
        reorderEnabled: false,
      },
    })
  } else {
    layout.replace({
      ...oldLayout,
      settings: {
        ...settings,
        hasHeaders: true,
        reorderEnabled: true,
      },
      dimensions: {
        ...dimensions,
        headerHeight: 25,
      },
    })
  }
}

const openFinSnapshotCurrentKey = (app: AppName) =>
  `OPENFIN_SNAPSHOT_CURRENT_${app}`
const openFinSnapshotNamesKey = (app: AppName) =>
  `OPENFIN_SNAPSHOT_NAMES_${app}`
const openFinSnapshotsKey = (app: AppName) => `OPENFIN_SNAPSHOTS_${app}`
const openFinSnapshotDefaultNameKey = (app: AppName) => `RTC - Default - ${app}`

export type AppName = "CREDIT" | "FX"

export const resetCurrentSnapshotName = (app: AppName) => {
  setCurrentSnapshotName(app, openFinSnapshotDefaultNameKey(app))
}

export const getSnapshotNames = (app: AppName): Array<string> => {
  const snapshotNamesStr = window.localStorage.getItem(
    openFinSnapshotNamesKey(app),
  )
  if (snapshotNamesStr) {
    return JSON.parse(snapshotNamesStr)
  }
  return []
}

export const getSnapshots = (
  app: AppName,
): Record<string, OpenFin.Snapshot> => {
  const snapshotsStr = window.localStorage.getItem(openFinSnapshotsKey(app))
  if (snapshotsStr) {
    return JSON.parse(snapshotsStr)
  }
  return {}
}

const setCurrentSnapshotName = (app: AppName, snapshotName: string) => {
  window.localStorage.setItem(openFinSnapshotCurrentKey(app), snapshotName)
}
const setSnapshotNames = (app: AppName, snapshotNames: string[]) => {
  window.localStorage.setItem(
    openFinSnapshotNamesKey(app),
    JSON.stringify(snapshotNames),
  )
}
const setSnapshots = (
  app: AppName,
  snapshots: Record<string, OpenFin.Snapshot>,
) => {
  window.localStorage.setItem(
    openFinSnapshotsKey(app),
    JSON.stringify(snapshots),
  )
}

export const applySnapshotFromStorage = async (
  app: AppName,
  snapshotName: string,
) => {
  const platform = await fin.Platform.getCurrent()
  const snapshotNames = getSnapshotNames(app)
  const snapshots = getSnapshots(app)

  if (snapshotNames.includes(snapshotName)) {
    setCurrentSnapshotName(app, snapshotName)
    await platform.applySnapshot(snapshots[snapshotName])
    return true
  }
  return false
}

export const saveSnapshotToStorage = async (
  app: AppName,
  newSnapshotName: string,
) => {
  const platform = await fin.Platform.getCurrent()
  const snapshot = await platform.getSnapshot()

  const snapshotNames = getSnapshotNames(app)

  if (!snapshotNames.includes(newSnapshotName)) {
    const snapshots = getSnapshots(app)
    snapshots[newSnapshotName] = snapshot

    setCurrentSnapshotName(app, newSnapshotName)
    setSnapshotNames(app, [...snapshotNames, newSnapshotName])
    setSnapshots(app, snapshots)
  }
}

export function useAppNameForSnapshots() {
  const { app } = queryString.parse(useLocation().search)
  if (!app || (app !== "FX" && app !== "CREDIT")) {
    throw new TypeError("expected app name in query string to be FX or CREDIT")
  }
  return app as AppName
}
