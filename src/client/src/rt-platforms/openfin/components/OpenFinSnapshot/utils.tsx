import {
  OPENFIN_SNAPSHOT_CURRENT,
  OPENFIN_SNAPSHOT_DEFAULT_NAME,
  OPENFIN_SNAPSHOT_NAMES,
  OPENFIN_SNAPSHOTS,
} from 'rt-platforms/openfin/StorageItems'

export const resetCurrentSnapshotName = () => {
  setCurrentSnapshotName(OPENFIN_SNAPSHOT_DEFAULT_NAME)
}

export const getSnapshotNames = () => {
  const snapshotNamesStr = window.localStorage.getItem(OPENFIN_SNAPSHOT_NAMES)
  if (snapshotNamesStr) {
    return JSON.parse(snapshotNamesStr)
  }
  return []
}

export const getSnapshots = () => {
  const snapshotsStr = window.localStorage.getItem(OPENFIN_SNAPSHOTS)
  if (snapshotsStr) {
    return JSON.parse(snapshotsStr)
  }
  return { snapshots: {} }
}

const setCurrentSnapshotName = (snapshotName: string) => {
  window.localStorage.setItem(OPENFIN_SNAPSHOT_CURRENT, snapshotName)
}
const setSnapshotNames = (snapshotNames: string[]) => {
  window.localStorage.setItem(OPENFIN_SNAPSHOT_NAMES, JSON.stringify(snapshotNames))
}
const setSnapshots = (snapshots: any) => {
  window.localStorage.setItem(OPENFIN_SNAPSHOTS, JSON.stringify(snapshots))
}

export const applySnapshotFromStorage = async (snapshotName: string) => {
  const platform = await fin.Platform.getCurrent()
  const snapshotNames = getSnapshotNames()
  const snapshots = getSnapshots()

  if (snapshotNames.includes(snapshotName)) {
    setCurrentSnapshotName(snapshotName)
    await platform.applySnapshot(snapshots.snapshots[snapshotName], {
      closeExistingWindows: true,
    })
    return true
  }
  return false
}

export const saveSnapshotToStorage = async (newSnapshotName: string) => {
  const platform = await fin.Platform.getCurrent()
  const snapshot = await platform.getSnapshot()

  const snapshotNames = getSnapshotNames()
  const snapshots = getSnapshots()
  snapshots.snapshots[newSnapshotName] = snapshot

  setCurrentSnapshotName(newSnapshotName)
  setSnapshotNames([...snapshotNames, newSnapshotName])
  setSnapshots(snapshots)
}

/**
 * Toggles the Platform controls
 *
 * Manually created windows are not part of the layout. Layout windows all start
 * with 'internal-generated', so we find one of those windows to retrieve the
 * layout.
 *
 * https://developers.openfin.co/docs/recipes-platform
 *
 */
export const toggleLockedLayout = async () => {
  const thisApp = fin.Application.getCurrentSync()
  const childWindows = await thisApp.getChildWindows()
  const internallyGeneratedWindows = childWindows.filter(
    w => w.identity.name && w.identity.name.startsWith('internal-generated')
  )

  if (internallyGeneratedWindows.length < 1) {
    console.error('Attempting to toggle layout, but no layout windows found')
    return
  }

  const layout = fin.Platform.Layout.wrapSync(internallyGeneratedWindows[0].identity)

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
