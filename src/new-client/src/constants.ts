export const GA_TRACKING_ID = "UA-46320965-5"
export const DOMAIN = (import.meta.env.DOMAIN || "") as string
export const BASE_URL = (import.meta.env.PATH || "") as string
export const ENVIRONMENT =
  ["env", "dev", "uat", "prod"].find((env) => DOMAIN.includes(`.${env}.`)) ||
  "local"
