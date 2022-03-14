import {
  init as workspacePlatformInit
} from '@openfin/workspace-platform'
import { connectToGateway } from '@adaptive/hydra-platform'
import { registerHome, showHome, deregisterHome } from './home'
import { registerStore, deregisterStore } from './store'
import { registerNotifications } from './home/notifications'
import { BASE_URL } from './consts'
import { customActions, overrideCallback } from './browser'

async function init() {
  await workspacePlatformInit({
    browser: {
      overrideCallback
    },
    customActions,
    theme: [
      {
        label: 'Dark',
        logoUrl: `${BASE_URL}/favicon.ico`,
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
    autoReconnect: true,
    useJson: true
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
