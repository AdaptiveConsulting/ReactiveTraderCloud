import {
  OPENFIN_SNAPSHOT_CURRENT,
  OPENFIN_SNAPSHOT_DEFAULT_NAME,
  OPENFIN_SNAPSHOT_NAMES,
  OPENFIN_SNAPSHOTS
} from "../StorageItems"
import canned from "./canned.json"
import { finWithPlatform } from '../OpenFinWithPlatform'
import {union} from "lodash"

export const resetCurrentSnapshotName = () => {
  setCurrentSnapshotName(OPENFIN_SNAPSHOT_DEFAULT_NAME)
}

export const getCurrentSnapshotName = () => {
  return window.localStorage.getItem(OPENFIN_SNAPSHOT_CURRENT) || ''
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
  return {}
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

// const setPlatformSnapshotName = async (platform: any, platformSnapshotName: string) => {
//   await platform.setContext({platformSnapshotName})
//   return platformSnapshotName
// }

export const applySnapshotFromStorage = (snapshotName: string) => {
  return finWithPlatform.Platform.getCurrent()
    .then((platform: any) => {
      const currentSnapshotName = getCurrentSnapshotName()
      const snapshotNames = getSnapshotNames()
      const snapshots = getSnapshots()
      if (snapshotName !== currentSnapshotName && snapshotNames.includes(snapshotName)) {
        setCurrentSnapshotName(snapshotName)
        return platform.applySnapshot(snapshots.snapshots[snapshotName], { closeExistingWindows: true })
      }
      return false
    })
}
export const applySnapshotFromStorageOnLoad = async () => {

  //TODO: Wait for OpenFin to complete Platform context get/set.

  //const platform = await finWithPlatform.Platform.getCurrent()
  //const platformCtx = await platform.getContext() || {}

  const currentSnapshotName = getCurrentSnapshotName()
  const snapshots = getSnapshots()

  //let platformSnapshotName = platformCtx.platformSnapshotName
  //let currentSnapshot = snapshots[currentSnapshotName]

  // @ts-ignore
  if (!currentSnapshotName || snapshots.version !== canned.version) {

    console.log('HGELLO!!!!!!!!')
    const snapshotNames = getSnapshotNames()

    let canned_snapshots_str = JSON.stringify(canned.snapshots)
    canned_snapshots_str = canned_snapshots_str.replace(
      new RegExp(/\"url\":*\"/, 'g'),
      `"url": "${window.location.origin}`
    )
    const canned_snapshots_json = JSON.parse(canned_snapshots_str)

    setSnapshotNames(union(snapshotNames, Object.keys(canned_snapshots_json)))
    setSnapshots({
      version: canned.version,
      snapshots: {
        ...(snapshots.version ? snapshots.snapshots : snapshots),
        ...canned_snapshots_json
      }
    })
    setCurrentSnapshotName(OPENFIN_SNAPSHOT_DEFAULT_NAME)
    //platformSnapshotName = OPENFIN_SNAPSHOT_DEFAULT_NAME
  }

  // if (platformSnapshotName !== currentSnapshotName) {
  //   platformSnapshotName = await setPlatformSnapshotName(platform, currentSnapshotName)
  // }
  // if (platformSnapshotName !== OPENFIN_SNAPSHOT_DEFAULT_NAME) {
  //  return !!(await platform.applySnapshot(currentSnapshot, { closeExistingWindows: true }))
  // }
}
export const saveSnapshotToStorage = async (newSnapshotName: string) => {

  const platform = await finWithPlatform.Platform.getCurrent()
  const snapshot = await platform.getSnapshot()

  const snapshotNames = getSnapshotNames()
  const snapshots = getSnapshots()
  snapshots.snapshots[newSnapshotName] = snapshot

  setCurrentSnapshotName(newSnapshotName)
  setSnapshotNames([...snapshotNames, newSnapshotName])
  setSnapshots(snapshots)
}
