import { init as workspacePlatformInit } from '@openfin/workspace-platform'
import { connectToGateway } from '@adaptive/hydra-platform'
import { registerHome, showHome, deregisterHome } from './home'
import { registerStore, deregisterStore } from './store'

async function init() {
  await workspacePlatformInit({
    browser: {},
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
