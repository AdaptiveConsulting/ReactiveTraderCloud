/*
TODO:

We have commented-out the platform context snapshot code
pre-webinar (on 17.3.2020) due to an issue that was causing
the app to loop indefinitely.

After the webinar we should re-implement this functionality
and find the root cause of the bug causing the infinite loop.
*/

import {
  OPENFIN_SNAPSHOT_CURRENT,
  OPENFIN_SNAPSHOT_DEFAULT_NAME,
  OPENFIN_SNAPSHOT_NAMES,
  OPENFIN_SNAPSHOTS,
} from '../StorageItems'
import canned from './canned.json'
import { finWithPlatform } from '../OpenFinWithPlatform'
import { union } from 'lodash'

export const resetCurrentSnapshotName = () => {
  setCurrentSnapshotName(OPENFIN_SNAPSHOT_DEFAULT_NAME)
}

export const getCurrentSnapshotName = () => {
  return window.localStorage.getItem(OPENFIN_SNAPSHOT_CURRENT) || OPENFIN_SNAPSHOT_DEFAULT_NAME
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

const setPlatformSnapshotName = async (platform: any, platformSnapshotName: string) => {
  await platform.setContext({ platformSnapshotName })
  return platformSnapshotName
}

export const applySnapshotFromStorage = (snapshotName: string) => {
  return finWithPlatform.Platform.getCurrent().then((platform: any) => {

    const snapshotNames = getSnapshotNames()
    const snapshots = getSnapshots()

    if (snapshotNames.includes(snapshotName)) {
      setCurrentSnapshotName(snapshotName)
      return platform.applySnapshot(snapshots.snapshots[snapshotName], {
        closeExistingWindows: true,
      })
    }
    return false
  })
}

export const applySnapshotFromStorageOnLoad = async () => {
  const platform = await finWithPlatform.Platform.getCurrent()
  const platformCtx = await platform.getContext() || {}

  const currentSnapshotName = getCurrentSnapshotName()
  const snapshots = getSnapshots()

  let platformSnapshotName = platformCtx.platformSnapshotName
  let currentSnapshot = snapshots.snapshots && snapshots.snapshots[currentSnapshotName]

  if (snapshots.version !== canned.version) {
    const snapshotNames = getSnapshotNames()

    let canned_snapshots_str = JSON.stringify(canned.snapshots)
    canned_snapshots_str = canned_snapshots_str.replace(
      new RegExp(/"url":*"/, 'g'),
      `"url": "${window.location.origin}`,
    )
    const canned_snapshots_json = JSON.parse(canned_snapshots_str)

    setSnapshotNames(union(snapshotNames, Object.keys(canned_snapshots_json)))
    setSnapshots({
      version: canned.version,
      snapshots: {
        ...(snapshots.version ? snapshots.snapshots : snapshots),
        ...canned_snapshots_json,
      },
    })

    platformSnapshotName = OPENFIN_SNAPSHOT_DEFAULT_NAME
    setCurrentSnapshotName(platformSnapshotName)
    platform.applySnapshot(getSnapshots().snapshots[platformSnapshotName])
  }

  if (platformSnapshotName !== currentSnapshotName) {
    platformSnapshotName = await setPlatformSnapshotName(platform, currentSnapshotName)
  }

  if (platformSnapshotName !== OPENFIN_SNAPSHOT_DEFAULT_NAME) {
    return !!(platform.applySnapshot(currentSnapshot))
  }
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
