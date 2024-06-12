// This optional code is used to register a service worker.
// register() is not called by default.

import { ENVIRONMENT } from "@/client/constants"

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://cra.link/PWA

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/,
    ),
)

type Config = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void
  onUpdate?: (registration: ServiceWorkerRegistration) => void
}

const envDeploymentRootRegex = /(https:\/\/[^/]*\/[^/]*\/[^/]*\/).*/
const doubleSlashesInURLRegex = /([^:])(\/{2,})/g

export function register(config?: Config) {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      // For env deployments, cannot just be .href - we need to get the /branch/blah or /pull/2345 bit
      // as we can load the app with /credit, /fx-blotter etc.
      const baseAddress =
        ENVIRONMENT === "env"
          ? window.location.href.replace(envDeploymentRootRegex, "$1")
          : window.location.origin
      const swUrl = `${baseAddress}/sw.js`.replace(
        doubleSlashesInURLRegex,
        "$1/",
      )

      if (isLocalhost) {
        // This is running on localhost. Let's check if a service worker still exists or not.
        checkValidServiceWorker(swUrl, config)
      } else {
        // Is not localhost. Just register service worker
        registerServiceWorker(swUrl, config)
      }
    })
  }
}

// use a common handler for the 2 cases where we want to respond to a new SW (and associated modules in precache)
function addStateChangeHandler(
  serviceWorkerInstance: ServiceWorker,
  registration: ServiceWorkerRegistration,
  registrationConfig: Config | undefined,
) {
  const firstInstall = !navigator.serviceWorker.controller

  serviceWorkerInstance.onstatechange = () => {
    console.debug(
      "'installing' SW changed state to: ",
      serviceWorkerInstance.state,
    )
    if (serviceWorkerInstance.state === "installed") {
      if (navigator.serviceWorker.controller) {
        // At this point, the updated precached content has been fetched,
        // but the previous service worker will still serve the older
        // content until all client tabs are closed.
        console.debug(
          "New content is available and will be used when all " +
            "tabs for this page are closed. See https://cra.link/PWA.",
        )
        // Case 1 - the normal cycle where we catch the SW as it is "installing"
        // we do the "skip" as we want the new SW to take over ASAP - this means it becomes the
        // 'controller' once "activated" and will serve any new modules from the new cache entries
        // those will not be available until it has reached the "activated" state though - see below
        serviceWorkerInstance.postMessage({ type: "SKIP_WAITING" })
      } else {
        // At this point, everything has been precached.
        // It's the perfect time to display a
        // "Content is cached for offline use." message.
        console.debug("Content is cached for offline use.")

        // Execute callback
        if (registrationConfig && registrationConfig.onSuccess) {
          registrationConfig.onSuccess(registration)
        }
      }
    } else if (serviceWorkerInstance.state === "activated") {
      // for ALL cases, only trigger the update behaviour (the popup) when the SW update process
      // is fully completed - the "activated" state - at this point, if you check
      // `navigator.serviceWorker.controller`, you will see the latest SW instance
      if (!firstInstall && registrationConfig && registrationConfig.onUpdate) {
        registrationConfig.onUpdate(registration)
      }
    }
  }
}

function registerServiceWorker(swUrl: string, config?: Config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.debug("SW Reg: handling ..", registration)
      // Case 2 - on registration, the SW is _already_ at "installed", so is waiting if you check Application tab in devtools
      // - this could be because of a slow lifecycle (connection speed seems to be a factor, although it should
      // be even less likely to have reached "installed" with a slow connection, right?)
      // - you can certainly trigger this, though, by refreshing part way through the installing state,
      // so that when you get the register() response it has got to "installed".
      if (registration.waiting) {
        const waitingWorker = registration.waiting
        console.debug(
          "'waiting' SW found .. skip waiting in case",
          waitingWorker,
        )
        waitingWorker.postMessage({ type: "SKIP_WAITING" })
        addStateChangeHandler(waitingWorker, registration, config)
      }

      registration.addEventListener("updatefound", (event) => {
        console.debug("SW Reg: updatefound fired", event)

        const installingWorker = registration.installing
        if (installingWorker == null) {
          console.debug("No 'installing' SW found")
          return
        }

        addStateChangeHandler(installingWorker, registration, config)
      })
    })
    .catch((error) => {
      console.error("Error during service worker registration:", error)
    })
}

function checkValidServiceWorker(swUrl: string, config?: Config) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl, {
    headers: { "Service-Worker": "script" },
  })
    .then((response) => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get("content-type")
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf("javascript") === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload()
          })
        })
      } else {
        // Service worker found. Proceed as normal.
        registerServiceWorker(swUrl, config)
      }
    })
    .catch(() => {
      console.log(
        "No internet connection found. App is running in offline mode.",
      )
    })
}
