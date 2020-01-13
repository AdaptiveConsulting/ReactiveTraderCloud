import { InteropTopics, Platform, platformHasFeature, PlatformWindow } from 'rt-platforms'
import { stringify } from 'query-string'
import { defaultConfig, windowOrigin } from './defaultWindowConfig'
import { BlotterFilters, validateFilters } from 'apps/MainRoute/widgets/blotter/blotterTradesFilter'

let openedWindow: PlatformWindow | undefined

function updatedOpenedWindow(
  blotterWindow: PlatformWindow,
  filters: BlotterFilters,
  platform: Platform,
) {
  if (platformHasFeature(platform, 'interop')) {
    platform.interop.publish(InteropTopics.FilterBlotter, filters)
  } else {
    console.log(`Interop publishing is not available, skipping updating blotter filters`)
  }
  blotterWindow.restore && blotterWindow.restore()
  blotterWindow.bringToFront && blotterWindow.bringToFront()
}

async function openNewWindow(
  filters: BlotterFilters,
  platform: Platform,
): Promise<PlatformWindow | undefined> {
  const baseUrl = `${windowOrigin}/blotter`
  const queryString = stringify(validateFilters(filters))
  const url = queryString ? `${baseUrl}/?${queryString}` : baseUrl

  return await platform.window.open(
    {
      ...defaultConfig,
      width: 1100,
      url,
    },
    () => (openedWindow = undefined),
  )
}

export async function showBlotter(filters: BlotterFilters, platform: Platform) {
  if (openedWindow) {
    updatedOpenedWindow(openedWindow, filters, platform)
    return
  }

  openedWindow = await openNewWindow(filters, platform)
  if (!openedWindow) {
    console.log(`Error opening new window`)
  }
}
