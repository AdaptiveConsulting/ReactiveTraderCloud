import { useEffect } from "react"
import { Helmet } from "react-helmet"

const LAYOUT_ITEMS = {
  Blotter: "stream",
  Analytics: "chart-line",
  Pricing: "dollar-sign",
}

type LayoutKey = keyof typeof LAYOUT_ITEMS

const getEmptyContent = (key: LayoutKey, useIcon: boolean = true) => {
  if (useIcon) {
    const icon = LAYOUT_ITEMS[key]
    if (icon) {
      return `<i style="font-size: 6rem" class="fas fa-${icon} fa-set-position" />`
    }
  }
  return key
}

export const WindowViewport: React.FC = ({ children }) => {
  //TODO: Remove this HACK once OpenFin exposes content of "empty" layout containers...
  useEffect(() => {
    //@ts-ignore
    if (!window.fin.me.isView) {
      const listenerViewAttached = (e: any) => {
        //const label: string = ((e || {}).viewIdentity || {}).name || "unknown"
        // ReactGA.event({ category: "RT - Tab", action: "attach", label })
      }
      const listenerViewDetached = (e: any) => {
        //const label: string = ((e || {}).viewIdentity || {}).name || "unknown"
        // ReactGA.event({ category: "RT - Tab", action: "detach", label })
      }
      const listenerViewHidden = (e: any) => {
        const layoutItems: HTMLCollectionOf<Element> =
          document.getElementsByClassName("lm_item")
        for (let idx in layoutItems) {
          const layoutItem = layoutItems[idx]
          if (layoutItem && layoutItem.querySelector) {
            const placeholder = layoutItem.querySelector(".wrapper_title")
            const tab = layoutItem.querySelector(".lm_tab.lm_active .lm_title")
            if (placeholder && tab) {
              placeholder.innerHTML = getEmptyContent(
                tab.innerHTML as LayoutKey,
                false,
              )
            }
          }
        }
      }
      const listenerWindowCreated = (e: any) => {
        //const label: string = (e || {}).name || "unknown"
        // ReactGA.event({ category: "RT - Window", action: "open", label })
      }
      const listenerWindowClosed = (e: any) => {
        //const label: string = (e || {}).name || "unknown"
        // ReactGA.event({ category: "RT - Window", action: "close", label })
      }

      fin.Window.getCurrent()
        .then((window) => {
          window.addListener("view-attached", listenerViewAttached)
          window.addListener("view-detached", listenerViewDetached)
        })
        .catch((ex) => console.warn(ex))
      fin.Application.getCurrent()
        .then((app) => {
          app.addListener("view-hidden", listenerViewHidden)
          app.addListener("window-closed", listenerWindowClosed)
          app.addListener("window-created", listenerWindowCreated)
        })
        .catch((ex) => console.warn(ex))

      return () => {
        fin.Window.getCurrent()
          .then((window) => {
            window.removeListener("view-attached", listenerViewAttached)
            window.removeListener("view-detached", listenerViewDetached)
          })
          .catch((ex) => console.warn(ex))
        fin.Application.getCurrent()
          .then((app) => {
            app.removeListener("view-hidden", listenerViewHidden)
            app.removeListener("window-closed", listenerWindowClosed)
            app.removeListener("window-created", listenerWindowCreated)
          })
          .catch((ex) => console.warn(ex))
      }
    }
  }, [])

  return (
    <>
      <Helmet>
        <style>
          {`
            :root, body, #root {
              overflow: hidden;
              min-height: 100%;
              max-height: 100vh;
              font-size: 16px;
            }

            body, select, button, li, span, div {
              font-family: inherit;
              color: inherit;
            }
          `}
        </style>
      </Helmet>
      {children}
    </>
  )
}
