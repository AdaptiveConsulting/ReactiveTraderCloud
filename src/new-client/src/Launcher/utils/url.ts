import { BASE_URL, ENVIRONMENT } from "@/constants"
import { constructUrl } from "@/utils/url"

export const getReactiveTraderUrl = (path: string) =>
  constructUrl(
    path,
    ENVIRONMENT !== "local"
      ? BASE_URL.replace("launcher", "openfin")
      : "http://localhost:1917",
  )
