export const GA_TRACKING_ID = "UA-46320965-5"
export const ENVIRONMENT = (import.meta.env.ENVIRONMENT || "local") as string
export const BASE_URL =
  // BASE_URL injected by GH workflow is either full url (for OpenFin), a relative path or / on localhost
  import.meta.env.BASE_URL && import.meta.env.BASE_URL.startsWith("http")
    ? new URL(import.meta.env.BASE_URL).pathname
    : import.meta.env.BASE_URL || ""

console.log("ENVIRONMENT", ENVIRONMENT)
console.log("import.meta.env.ENVIRONMENT ", import.meta.env.ENVIRONMENT)
console.log("BASE_URL", BASE_URL)
console.log("import.meta.env.BASE_URL", import.meta.env.BASE_UR)
