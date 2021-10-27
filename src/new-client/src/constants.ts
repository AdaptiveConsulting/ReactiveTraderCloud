export const GA_TRACKING_ID = "UA-46320965-5"
export const DOMAIN = (import.meta.env.DOMAIN || "") as string
export const BASE_URL = (import.meta.env.URL_PATH || "") as string
export const ENVIRONMENT =
  ["env", "dev", "uat", "prod"].find((env) => DOMAIN.includes(`.${env}.`)) ||
  "local"
const thisEnv = import.meta.env
console.log("thisEnv", thisEnv)
console.log("DOMAIN", DOMAIN)
console.log("BASE_URL", BASE_URL)
console.log("ENVIRONMENT", ENVIRONMENT)
