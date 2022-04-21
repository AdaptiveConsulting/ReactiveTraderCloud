import { init as workspacePlatformInit } from '@openfin/workspace-platform'
import { connectToGateway } from '@adaptive/hydra-platform'
import { registerHome, showHome, deregisterHome } from './home'
import { registerStore, deregisterStore } from './store'
import { registerNotifications } from './home/notifications'
import { BASE_URL } from './consts'
import { customActions, overrideCallback } from './browser'

const icon = `${BASE_URL}/images/icons/adaptive.png`

async function init() {
  await workspacePlatformInit({
    browser: {
      overrideCallback,
      defaultWindowOptions: {
        icon,
        workspacePlatform: {
          pages: [],
          favicon: icon
        }
      }
    },
    customActions,
    theme: [
      {
        label: 'Dark',
        logoUrl: icon,
        palette: {
          brandPrimary: '#282E39',
          brandSecondary: '#FFF',
          backgroundPrimary: '#2F3542'
        }
      }
    ]
  })
  await registerHome()
  await registerNotifications()
  await registerStore()
  await showHome()

  await connectToGateway({
    url: `${window.location.origin}/ws`,
    interceptor: () => null,
    autoReconnect: true
  })

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
