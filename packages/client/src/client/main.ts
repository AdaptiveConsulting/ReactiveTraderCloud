import { WebApp } from "./Web"
import { showCacheUpdateModal } from "./Web/cacheUpdateModal"
import { register } from "./Web/serviceWorkerRegistration"

export const gaDimension = "browser"

export const getMainApp: () => React.FC = () => {
  if (import.meta.env.PROD) {
    console.debug("Register service worker")
    register({
      onUpdate: () => {
        // The update process has been extensively tested now
        // If it reaches this stage, then the registration method has waited for a new SW to be installed
        // and we are now ready to trigger a refresh to run the new components
        // (which are in the cache waiting to be activated)
        console.debug(
          "Service worker onUpdate - should now be activated - show update modal",
        )
        showCacheUpdateModal()
      },
    })
  }

  return WebApp
}
