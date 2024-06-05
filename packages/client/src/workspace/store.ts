import {
  App,
  Storefront,
  StorefrontFooter,
  StorefrontLandingPage,
  StorefrontNavigationSection,
  StorefrontProvider,
  StorefrontTemplate,
} from "@openfin/workspace"
import { getCurrentSync } from "@openfin/workspace-platform"

import {
  getApps,
  getSnapshots,
  getViews,
  limitCheckerView,
  reactiveTraderFxTradesView,
} from "./apps"
import { WS_BASE_URL } from "./constants"
import { getCurrentUser, USER_TRADER } from "./user"
import { getAllApps, getSpotTileApps } from "./utils"

const PROVIDER_ID = "adaptive-store-provider"

export async function registerStore() {
  console.log("Initialising the storefront provider.")
  const provider = await getStoreProvider()
  try {
    await Storefront.register(provider)
    console.log("Storefront provider initialised.")
  } catch (err) {
    console.error(
      "An error was encountered while trying to register the content store provider",
      err,
    )
  }
}

export async function deregisterStore() {
  return Storefront.deregister(PROVIDER_ID)
}

export async function showStore() {
  console.log("Showing the store.")
  return Storefront.show()
}

export async function hideStore() {
  console.log("Hiding the store.")
  return Storefront.hide()
}

async function getStoreProvider(): Promise<StorefrontProvider> {
  console.log("Getting the store provider.")

  return {
    id: PROVIDER_ID,
    title: "Adaptive",
    icon: `${WS_BASE_URL}/favicon.ico`,
    getNavigation,
    getLandingPage,
    getFooter,
    getApps: getAllApps,
    launchApp: async (app: App) => {
      if (app.manifestType === "external") {
        fin.System.launchExternalProcess({
          alias: app.manifest,
          listener: (result) => {
            console.log("the exit code", result.exitCode)
          },
        })
          .then((data) => {
            console.info("Process launched: ", data)
          })
          .catch((e) => {
            console.error("Process launch failed: ", e)
          })
      } else if (app.manifestType === "url") {
        const platform = getCurrentSync()
        platform.createView({
          url: app.manifest,
          bounds: { top: 0, left: 0, width: 320, height: 180 },
        })
      } else {
        const platform = getCurrentSync()
        await platform.launchApp({ app })
      }
    },
  }
}

async function getNavigation(): Promise<
  [StorefrontNavigationSection, StorefrontNavigationSection?]
> {
  console.log("Showing the store navigation.")
  const currentUser = getCurrentUser()
  const spotTileApps = await getSpotTileApps()

  const navigationSections: [
    StorefrontNavigationSection,
    StorefrontNavigationSection?,
  ] = [
    {
      id: "apps",
      title: "Apps",
      items: [
        {
          id: "manifest",
          title: "Apps",
          templateId: StorefrontTemplate.AppGrid,
          templateData: {
            apps: getApps(),
          },
        },
        {
          id: "view",
          title: "Views",
          templateId: StorefrontTemplate.AppGrid,
          templateData: {
            apps: getViews(),
          },
        },
      ],
    },
  ]

  if (currentUser === USER_TRADER) {
    navigationSections[0].items.push({
      id: "snapshot",
      title: "Snapshots",
      templateId: StorefrontTemplate.AppGrid,
      templateData: {
        apps: getSnapshots(),
      },
    })
    navigationSections.push({
      id: "fx",
      title: "FX",
      items: [
        {
          id: "spot-tiles",
          title: "Spot Tiles",
          templateId: StorefrontTemplate.AppGrid,
          templateData: {
            apps: spotTileApps,
          },
        },
      ],
    })
  }

  return navigationSections
}

async function getLandingPage(): Promise<StorefrontLandingPage> {
  console.log("Getting the store landing page.")
  const currentUser = getCurrentUser()

  const landingPage: StorefrontLandingPage = {
    hero: {
      title: "Reactive Trader",
      description:
        "Reactive Trader® is our real-time, fully open-source showcase trading platform",
      cta: {
        id: "hero-1",
        title: "Explore",
        templateId: StorefrontTemplate.AppGrid,
        templateData: {
          apps: getApps(),
        },
      },
      image: {
        src: `${WS_BASE_URL}/images/previews/reactive-trader.PNG`,
      },
    },
    topRow: {
      title: "Collections",
      items: [
        {
          id: "collections-apps",
          title: "Web Apps",
          description: "A collection of web apps built using OpenFin.",
          image: {
            src: `${WS_BASE_URL}/images/previews/reactive-trader.PNG`,
          },
          templateId: StorefrontTemplate.AppGrid,
          templateData: {
            apps: getApps(),
          },
        },
        {
          id: "collections-views",
          title: "Views",
          description:
            "A collection of views made available through our catalog.",
          image: {
            src: `${WS_BASE_URL}/images/previews/trades-view.PNG`,
          },
          templateId: StorefrontTemplate.AppGrid,
          templateData: {
            apps: getViews(),
          },
        },
      ],
    },
    middleRow: {
      title: "Interop Views",
      apps:
        currentUser === USER_TRADER
          ? [
              {
                ...reactiveTraderFxTradesView,
                description:
                  "FX Trades view - combine with Limit Checker view (Operations user)",
                icons: [
                  {
                    src: `${WS_BASE_URL}/images/previews/interop-with-views-color-linking.png`,
                  },
                ],
              },
            ]
          : [
              {
                ...limitCheckerView,
                description:
                  "Limit Checker view - combine with FX Trades view (Trader user)",
                icons: [
                  {
                    src: `${WS_BASE_URL}/images/previews/interop-with-views-color-linking.png`,
                  },
                ],
              },
            ],
    },

    bottomRow: {
      title: "Quick Access",
      items: [
        {
          id: "quick-access",
          title: "Apps & Views",
          description: "A collection of apps and views built using OpenFin.",
          image: {
            src: `${WS_BASE_URL}/images/previews/reactive-trader.PNG`,
          },
          templateId: StorefrontTemplate.AppGrid,
          templateData: {
            apps: getApps().concat(getViews()),
          },
        },
      ],
    },
  }

  return landingPage
}

async function getFooter(): Promise<StorefrontFooter> {
  console.log("Getting the store footer.")
  return {
    logo: { src: `${WS_BASE_URL}/favicon.ico`, size: "32" },
    text: "Powered by Adaptive",
    links: [
      {
        title: "Adaptive",
        url: "https://weareadaptive.com",
      },
      {
        title: "Github",
        url: "https://github.com/AdaptiveConsulting",
      },
    ],
  }
}
