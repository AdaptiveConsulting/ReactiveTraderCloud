type Environment = "local" | "env" | "dev" | "uat" | "prod"

export const GA_TRACKING_ID = "UA-46320965-5"
// Comes from vite.config - base
// Will be / for localhost or platform.env.reactivetrader.com
const BASE_URL = import.meta.env.BASE_URL
export const BASE_PATH =
  BASE_URL && BASE_URL.startsWith("http") ? new URL(BASE_URL).pathname : ""
export const ENVIRONMENT: Environment =
  (["env", "dev", "uat", "prod"].find((env) =>
    (BASE_URL || "").includes(`.${env}.`),
  ) as Environment) || "local"
export const IS_CREDIT_ENABLED =
  import.meta.env.VITE_IS_CREDIT_ENABLED === "yes"
console.log(`Credit feature is ${IS_CREDIT_ENABLED ? "en" : "dis"}abled`)

export const ROUTES_CONFIG = {
  tile: "/spot/:symbol",
  tiles: "/tiles",
  blotter: "/blotter",
  analytics: "/analytics",
  styleguide: "/styleguide",
  credit: "/credit",
}
