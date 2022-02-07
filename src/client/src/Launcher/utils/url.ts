import { ENVIRONMENT } from "@/constants"
import { constructUrl } from "@/utils/url"

export const getReactiveTraderUrl = (path: string) =>
  constructUrl(
    path,
    ENVIRONMENT !== "local"
      ? window.location.origin.replace("launcher", "openfin")
      : window.location.origin,
  )
