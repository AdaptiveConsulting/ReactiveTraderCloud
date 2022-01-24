import {
  BrowserOverrideCallback,
  CreateSavedPageRequest,
  init as workspacePlatformInit,
  UpdateSavedPageRequest
} from '@openfin/workspace-platform'
import { registerHome, showHome, deregisterHome } from './home'
import { registerStore, deregisterStore } from './store'

// TODO - Revisit when we can launch a page from config (at the moment we can only do so with a manifestUrl)
const overrideCallback: BrowserOverrideCallback = async WorkspacePlatformProvider => {
  class Override extends WorkspacePlatformProvider {
    createSavedPage = async (req: CreateSavedPageRequest): Promise<void> => {
      localStorage.setItem(`page-${req.page.pageId}`, JSON.stringify(req.page))
    }

    updateSavedPage = async (req: UpdateSavedPageRequest): Promise<void> => {
      console.log(`saving page ${req.page.pageId}`)
      localStorage.setItem(`page-${req.page.pageId}`, JSON.stringify(req.page))
    }
  }

  return new Override()
}

async function init() {
  await workspacePlatformInit({
    browser: {
      overrideCallback
    },
    // TODO - home and store not themeable at the moment
    theme: [
      {
        label: 'Dark',
        palette: {
          brandPrimary: '#282E39',
          brandSecondary: '#FFF',
          backgroundPrimary: '#2F3542',
          background2: '#3D4455'
        }
      }
    ]
  })
  await registerHome()
  await registerStore()
  await showHome()

  const providerWindow = fin.Window.getCurrentSync()
  providerWindow.once('close-requested', async () => {
    await deregisterStore()
    await deregisterHome()
    fin.Platform.getCurrentSync().quit()
  })
}

window.addEventListener('DOMContentLoaded', async () => {
  await init()
})
