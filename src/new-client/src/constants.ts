export const GA_TRACKING_ID = "UA-46320965-5"
export const BASE_URL = import.meta.env.BASE_URL
export const BASE_PATH =
  BASE_URL && BASE_URL.startsWith("http") ? new URL(BASE_URL).pathname : ""
export const ENVIRONMENT =
  ["env", "dev", "uat", "prod"].find((env) => BASE_URL.includes(`.${env}.`)) ||
  "local"
