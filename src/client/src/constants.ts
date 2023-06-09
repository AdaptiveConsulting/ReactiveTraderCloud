type Environment = "local" | "env" | "dev" | "uat" | "prod"

export const GA_TRACKING_ID = "UA-46320965-5"
// Comes from vite.config - base
// Will be / for vite development mode (local),
// otherwise the full domain / path of the deployment e.g. https://web.env.reactivetrader.com/pull/2064
const BASE_URL = import.meta.env.BASE_URL
export const BASE_PATH =
  BASE_URL && BASE_URL.startsWith("http") ? new URL(BASE_URL).pathname : ""
export const ENVIRONMENT: Environment =
  (["env", "dev", "uat", "prod"].find((env) =>
    (BASE_URL || "").includes(`.${env}.`),
  ) as Environment) || "local"

// NOTE: these routes are hard coded in the OpenFin manifest JSON files,
// so any changes here need to be manually synchronized with those files.
export const ROUTES_CONFIG = {
  // fx
  tile: "/fx-spot/:symbol",
  tiles: "/fx-tiles",
  blotter: "/fx-blotter",
  analytics: "/fx-analytics",
  // credit
  credit: "/credit",
  creditRfqs: "/credit-rfqs",
  newRfq: "/credit-new-rfq",
  creditBlotter: "/credit-blotter",
  sellSide: "/credit-sellside",
  styleguide: "/styleguide",
  admin: "/admin",
  // openfin
  launcher: "/launcher",
  contact: "/contact",
  snapshots: "/snapshots",
  // admin/CI
  status: "/status",
  // limit checker
  limitChecker: "/limit-checker",
}

export const CREDIT_RFQ_EXPIRY_SECONDS = 120
export const CREDIT_SELL_SIDE_TICKET_HEIGHT = 262

export const HIGHLIGHT_ROW_FLASH_TIME = 3000
