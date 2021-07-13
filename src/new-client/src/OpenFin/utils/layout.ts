import { Snapshot } from "openfin/_v2/shapes/Platform"
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

const OPENFIN_SNAPSHOT_CURRENT: string = "OPENFIN_SNAPSHOT_CURRENT"
const OPENFIN_SNAPSHOT_NAMES: string = "OPENFIN_SNAPSHOT_NAMES"
const OPENFIN_SNAPSHOTS: string = "OPENFIN_SNAPSHOTS"
const OPENFIN_SNAPSHOT_DEFAULT_NAME: string = "RTC - Default"

export const resetCurrentSnapshotName = () => {
  setCurrentSnapshotName(OPENFIN_SNAPSHOT_DEFAULT_NAME)
}

export const getSnapshotNames = (): Array<string> => {
  const snapshotNamesStr = window.localStorage.getItem(OPENFIN_SNAPSHOT_NAMES)
  if (snapshotNamesStr) {
    return JSON.parse(snapshotNamesStr)
  }
  return []
}

export const getSnapshots = (): Record<string, Snapshot> => {
  const snapshotsStr = window.localStorage.getItem(OPENFIN_SNAPSHOTS)
  if (snapshotsStr) {
    return JSON.parse(snapshotsStr)
  }
  return {}
}

const setCurrentSnapshotName = (snapshotName: string) => {
  window.localStorage.setItem(OPENFIN_SNAPSHOT_CURRENT, snapshotName)
}
const setSnapshotNames = (snapshotNames: string[]) => {
  window.localStorage.setItem(
    OPENFIN_SNAPSHOT_NAMES,
    JSON.stringify(snapshotNames),
  )
}
const setSnapshots = (snapshots: Record<string, Snapshot>) => {
  window.localStorage.setItem(OPENFIN_SNAPSHOTS, JSON.stringify(snapshots))
}

export const applySnapshotFromStorage = async (snapshotName: string) => {
  const platform = await fin.Platform.getCurrent()
  const snapshotNames = getSnapshotNames()
  const snapshots = getSnapshots()

  if (snapshotNames.includes(snapshotName)) {
    setCurrentSnapshotName(snapshotName)
    await platform.applySnapshot(snapshots[snapshotName])
    return true
  }
  return false
}

export const saveSnapshotToStorage = async (newSnapshotName: string) => {
  const platform = await fin.Platform.getCurrent()
  const snapshot = await platform.getSnapshot()

  const snapshotNames = getSnapshotNames()

  if (!snapshotNames.includes(newSnapshotName)) {
    const snapshots = getSnapshots()
    snapshots[newSnapshotName] = snapshot

    setCurrentSnapshotName(newSnapshotName)
    setSnapshotNames([...snapshotNames, newSnapshotName])
    setSnapshots(snapshots)
  }
}
