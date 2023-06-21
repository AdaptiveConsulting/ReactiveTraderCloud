import { AnalyticsCoreDeferred } from "@/App/Analytics"
import { LiveRatesCoreDeferred } from "@/App/LiveRates"
import { TradesCoreDeferred } from "@/App/Trades"
import { WebApp } from "@/Web"
import { showCacheUpdateModal } from "@/Web/cacheUpdateModal"
import { register } from "@/Web/serviceWorkerRegistration"

export const gaDimension = "browser"

export const getMainApp: () => React.FC = () => {
  if (import.meta.env.PROD) {
    register({
      onUpdate: (registration) => {
        // If the SW got updated, then we have to be careful. We can't immediately
        // skip the waiting phase, because if there are requests on the fly that
        // could be a disaster
        // Wait for our async chunks to be loaded, then skip waiting phase and show
        // the user a modal informing them that there are new updates available

        console.log("Service worker on update")

        Promise.all([
          AnalyticsCoreDeferred,
          LiveRatesCoreDeferred,
          TradesCoreDeferred,
        ]).then(() => {
          console.log("Deferred components resolved, sending skip message")
          registration.waiting?.postMessage({ type: "SKIP_WAITING" })
          showCacheUpdateModal()
        })
      },
    })
  }

  return WebApp
}
