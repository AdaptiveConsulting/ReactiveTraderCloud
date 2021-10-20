export const GA_TRACKING_ID = "UA-46320965-5"
export const BASE_URL =
  // BASE_URL injected by GH workflow is either full url (for OpenFin), a relative path or / on localhost
  import.meta.env.BASE_URL && import.meta.env.BASE_URL.startsWith("http")
    ? new URL(import.meta.env.BASE_URL).pathname
    : import.meta.env.BASE_URL || ""
