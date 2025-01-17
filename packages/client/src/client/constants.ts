type Environment = "local" | "env" | "dev" | "uat" | "prod"

// import.meta.env.BASE_URL comes from vite.config.base, unless development mode when it is "/"
// otherwise the full domain / path of the deployment e.g. https://web.env.reactivetrader.com/pull/2064
// TODO (5636) launcher.*.reactivetrader.com should be Deprecated, but until we remove the deployment, leave the conversion
export const BASE_URL =
  import.meta.env.BASE_URL === "/"
    ? window.location.origin
    : import.meta.env.BASE_URL.replace("launcher", "openfin")

export const BASE_PATH =
  BASE_URL && BASE_URL.startsWith("http") ? new URL(BASE_URL).pathname : ""

export const ENVIRONMENT: Environment =
  (["env", "dev", "uat", "prod"].find((env) =>
    (BASE_URL || "").includes(`.${env}.`),
  ) as Environment) || "local"

// local/deployed diffs resolved in vite.config
export const manifestUrls = {
  reactiveTrader: `${BASE_URL}/config/rt-fx.json`,
  reactiveCredit: `${BASE_URL}/config/rt-credit.json`,
  limitChecker: `${BASE_URL}/config/limit-checker.json`,
}
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

export const WEBSITE = "https://weareadaptive.com"
export const AERON = "https://aeron.io"
export const EQUITIES = "https://mock-alpaca-demo.adaptivecluster.com"
export const EMAIL = "sales@weareadaptive.com"

export type SocialPlatform = "Twitter" | "LinkedIn" | "Github"
export const SOCIAL_ADDRESSES: Record<SocialPlatform, string> = {
  Twitter: "https://twitter.com/WeAreAdaptive",
  LinkedIn: "https://www.linkedin.com/company/adaptive-consulting-ltd/",
  Github: "https://github.com/adaptiveConsulting/",
}
