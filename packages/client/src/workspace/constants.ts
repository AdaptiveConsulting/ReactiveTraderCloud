export const BASE_URL =
  import.meta.env.BASE_URL === "/"
    ? window.location.origin
    : import.meta.env.BASE_URL

export const { VITE_RA_URL } = import.meta.env as Record<string, string>

export const VITE_RT_URL =
  (import.meta.env.VITE_RT_URL as string) ||
  window.location.href.replace("/workspace/workspaceProvider.html", "")

export const manifestUrls = {
  reactiveTrader: `${VITE_RT_URL}/config/rt-fx.json`,
  reactiveCredit: `${VITE_RT_URL}/config/rt-credit.json`,
  reactiveAnalytics: `${VITE_RA_URL}/openfin/app.json`,
  limitChecker: `${VITE_RT_URL}/config/limit-checker.json`,
}
