// import.meta.env.BASE_URL comes from vite.config.base, unless development mode when it is "/"
// otherwise the full domain / path of the deployment e.g. https://openfin .env.reactivetrader.com/pull/2064
export const BASE_URL =
  import.meta.env.BASE_URL === "/"
    ? window.location.origin
    : import.meta.env.BASE_URL

export const WS_BASE_URL = `${BASE_URL}/workspace`

export const VITE_RT_URL = (import.meta.env.VITE_RT_URL as string) || BASE_URL

export const manifestUrls = {
  reactiveTrader: `${VITE_RT_URL}/config/rt-fx.json`,
  reactiveCredit: `${VITE_RT_URL}/config/rt-credit.json`,
  limitChecker: `${VITE_RT_URL}/config/limit-checker.json`,
}
