import ReactGA from 'react-ga'
export const isOpenFin = 'fin' in window

export const handleBrowserLink = (gaArgs: ReactGA.EventArgs, href: string) => {
  ReactGA.event(gaArgs)
  if (isOpenFin) {
    fin.System.openUrlWithBrowser(href)
  } else {
    window.open(href)
  }
}
