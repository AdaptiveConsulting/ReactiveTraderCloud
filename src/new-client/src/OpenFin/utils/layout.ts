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
