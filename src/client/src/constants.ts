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

export const ROUTES_CONFIG = {
  tile: "/spot/:symbol",
  tiles: "/tiles",
  blotter: "/blotter",
  analytics: "/analytics",
  styleguide: "/styleguide",
  admin: "/admin",
  credit: "/credit",
  newRfq: "/credit/new-rfq",
  sellSideTicket: "/credit/sellside/:rfqId/dealer/:dealerId",
  creditBlotter: "/credit/blotter",
}
