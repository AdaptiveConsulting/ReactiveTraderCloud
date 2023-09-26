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
  limitChecker,
  limitCheckerView,
  reactiveAnalytics,
  reactiveAnalyticsView,
  reactiveTraderCredit,
  reactiveTraderFx,
  reactiveTraderFxAnalyticsView,
  reactiveTraderFxLiveRatesView,
  reactiveTraderFxTradesView,
  reactiveWorkspace,
} from "./apps"
import { BASE_URL } from "./constants"
import { getCurrentUser, USER_TRADER } from "./user"
import { getAllMainApps, getSpotTileApps } from "./utils"

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
    title: "Adaptive Store",
    icon: `${BASE_URL}/favicon.ico`,
    getNavigation,
    getLandingPage,
    getFooter,
    getApps: getAllMainApps,
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
          bounds: { width: 320, height: 180 },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
      } else {
        const platform = getCurrentSync()
        await platform.launchApp({ app })
      }
    },
  }
}

async function getNavigation(): Promise<
  [StorefrontNavigationSection?, StorefrontNavigationSection?]
> {
  console.log("Showing the store navigation.")
  const currentUser = getCurrentUser()
  const spotTileApps = await getSpotTileApps()

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const navigationSections: [
    StorefrontNavigationSection?,
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
        {
          id: "snapshot",
          title: "Snapshots",
          templateId: StorefrontTemplate.AppGrid,
          templateData: {
            apps: getSnapshots(),
          },
        },
      ],
    },
    currentUser === USER_TRADER
      ? {
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
        }
      : undefined,
  ].filter((i) => !!i)

  return navigationSections
}

async function getLandingPage(): Promise<StorefrontLandingPage> {
  console.log("Getting the store landing page.")

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
          apps: [reactiveTraderFx, reactiveAnalytics, limitCheckerView],
        },
      },
      image: {
        src: `${BASE_URL}/images/previews/reactive-trader.PNG`,
      },
    },
    topRow: {
      title: "Collections",
      items: [
        {
          id: "top-row-item-1",
          title: "Research",
          description:
            "Applications to research the current market data, trends etc...",
          image: {
            src: `${BASE_URL}/images/coding-1-unsplash.jpg`,
          },
          templateId: StorefrontTemplate.AppGrid,
          templateData: {
            apps: [reactiveAnalytics],
          },
        },
        {
          id: "top-row-item-2",
          title: "Tools",
          description: "Tools to help day to day operations",
          image: {
            src: `${BASE_URL}/images/coding-2-unsplash.jpg`,
          },
          templateId: StorefrontTemplate.AppGrid,
          templateData: {
            apps: [limitCheckerView],
          },
        },
      ],
    },
    middleRow: {
      title:
        "A collection of simple views that show how to share context using the Interop API.",
      apps: [reactiveTraderFxTradesView, reactiveAnalyticsView],
    },
    bottomRow: {
      title: "Quick Access",
      items: [
        {
          id: "bottom-row-item-2",
          title: "Web Apps",
          description: "A collection of web apps built using OpenFin.",
          image: {
            src: `${BASE_URL}/images/coding-5-unsplash.jpg`,
          },
          templateId: StorefrontTemplate.AppGrid,
          templateData: {
            apps: [reactiveTraderFx, reactiveAnalyticsView],
          },
        },
        {
          id: "bottom-row-item-1",
          title: "Views",
          description:
            "A collection of views made available through our catalog.",
          image: {
            src: `${BASE_URL}/images/coding-4-unsplash.jpg`,
          },
          templateId: StorefrontTemplate.AppGrid,
          templateData: {
            apps: [
              reactiveTraderFxLiveRatesView,
              reactiveTraderFxTradesView,
              reactiveTraderFxAnalyticsView,
              reactiveAnalyticsView,
            ],
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
    logo: { src: `${BASE_URL}/favicon.ico`, size: "32" },
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
