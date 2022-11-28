import { ENVIRONMENT } from "@/constants"
import { constructUrl } from "@/utils/url"

export const getReactiveTraderUrl = (path: string) =>
  constructUrl(
    path,
    ENVIRONMENT !== "local"
      ? window.location.origin.replace("launcher", "openfin")
      : window.location.origin,
  )

export const getReactiveAnalyticsUrls = (environment: string) => {
  switch (environment) {
    case "local":
      return "http://localhost:3005/openfin/app.json"
    case "env":
    case "dev":
      return "https://dev-reactive-analytics.adaptivecluster.com/openfin/app.json"
    case "uat":
      return "https://uat-reactive-analytics.adaptivecluster.com/openfin/app.json"
    case "prod":
    default:
      return "https://demo-reactive-analytics.adaptivecluster.com/openfin/app.json"
  }
}
