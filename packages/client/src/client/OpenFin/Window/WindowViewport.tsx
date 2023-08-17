import { joinChannel } from "@finos/fdc3"
import { EventHandler } from "@openfin/core/src/api/events/base"
import { ApplicationEvent, WindowEvent } from "@openfin/core/src/OpenFin"
import { Subscribe } from "@react-rxjs/core"
import { WithChildren } from "client/utils/utilityTypes"
import { useEffect } from "react"

import {
  CLOSING_WINDOW,
  OPENING_WINDOW,
  registerWindowEvent,
  windows$,
} from "./state"

const LAYOUT_ITEMS = {
  Blotter: "stream",
  Analytics: "chart-line",
  Pricing: "dollar-sign",
}

type LayoutKey = keyof typeof LAYOUT_ITEMS

const getEmptyContent = (key: LayoutKey, useIcon = true) => {
  if (useIcon) {
    const icon = LAYOUT_ITEMS[key]
    if (icon) {
      return `<i style="font-size: 6rem" class="fas fa-${icon} fa-set-position" />`
    }
  }
  return key
}

const WindowViewportComponent = ({ children }: WithChildren) => {
  //TODO: Remove this HACK once OpenFin exposes content of "empty" layout containers...
  useEffect(() => {
    joinChannel("green")

    if (!fin.me.isView) {
      const listenerViewAttached: EventHandler<WindowEvent, "view-attached"> = (
        _,
      ) => {
        //const label: string = ((e || {}).viewIdentity || {}).name || "unknown"
        // ReactGA.event({ category: "RT - Tab", action: "attach", label })
      }

      const listenerViewDetached: EventHandler<WindowEvent, "view-detached"> = (
        e,
      ) => {
        //const label: string = ((e || {}).viewIdentity || {}).name || "unknown"
        // ReactGA.event({ category: "RT - Tab", action: "detach", label })

        //openfin event types are not up to date
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        fin.View.wrap({ uuid: fin.me.uuid, name: e.viewIdentity.name }).then(
          (view) => view.focus(),
        )
      }

      const listenerViewDestroyed: EventHandler<WindowEvent, "view-destroyed"> =
        (_) => {
          //const label: string = ((e || {}).viewIdentity || {}).name || "unknown"
          // ReactGA.event({ category: "RT - Tab", action: "destroyed", label })
        }

      const listenerViewHidden: EventHandler<ApplicationEvent, "view-hidden"> =
        (_) => {
          //const label: string = ((e || {}).viewIdentity || {}).name || "unknown"
          // ReactGA.event({ category: "RT - Tab", action: "hidden", label })
          const layoutItems: HTMLCollectionOf<Element> =
            document.getElementsByClassName("lm_item")

          for (const idx in layoutItems) {
            const layoutItem = layoutItems[idx]

            if (layoutItem && layoutItem.querySelector) {
              const placeholder = layoutItem.querySelector(".wrapper_title")
              const tab = layoutItem.querySelector(
                ".lm_tab.lm_active .lm_title",
              )

              if (placeholder && tab) {
                placeholder.innerHTML = getEmptyContent(
                  tab.innerHTML as LayoutKey,
                  false,
                )
              }
            }
          }
        }

      const listenerWindowCreated: EventHandler<
        ApplicationEvent,
        "window-created"
      > = ({ uuid, name }) => {
        //const label: string = (e || {}).name || "unknown"
        // ReactGA.event({ category: "RT - Window", action: "open", label })

        fin.Window.wrap({ uuid, name }).then((newWindow) => {
          newWindow.addListener("view-attached", (e) => {
            registerWindowEvent({
              //openfin event types are not up to date
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              window: { name, view: e.viewIdentity.name },
              type: OPENING_WINDOW,
            })
          })
        })
      }

      const listenerWindowClosed: EventHandler<
        ApplicationEvent,
        "window-closed"
      > = ({ name }) => {
        //const label: string = (e || {}).name || "unknown"
        // ReactGA.event({ category: "RT - Window", action: "close", label })

        registerWindowEvent({
          window: { name },
          type: CLOSING_WINDOW,
        })
      }

      const listenerWindowClosing: EventHandler<
        ApplicationEvent,
        "window-closing"
      > = ({ name, uuid }) => {
        //const label: string = (e || {}).name || "unknown"
        // ReactGA.event({ category: "RT - Window", action: "closing", label })

        fin.Window.wrap({ uuid, name }).then((closingWindow) => {
          closingWindow.removeAllListeners()
        })
      }

      fin.Window.getCurrent()
        .then((window) => {
          window.addListener("view-attached", listenerViewAttached)
          window.addListener("view-detached", listenerViewDetached)
          window.addListener("view-destroyed", listenerViewDestroyed)
        })
        .catch((ex) => console.warn(ex))

      fin.Application.getCurrent()
        .then((app) => {
          app.addListener("view-hidden", listenerViewHidden)
          app.addListener("window-closing", listenerWindowClosing)
          app.addListener("window-closed", listenerWindowClosed)
          app.addListener("window-closing", listenerWindowClosing)
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
            app.removeListener("window-closing", listenerWindowClosing)
            app.removeListener("window-created", listenerWindowCreated)
          })
          .catch((ex) => console.warn(ex))
      }
    }
  }, [])

  useEffect(() => {
    const style = document.createElement("style")
    style.innerHTML = `
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
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return <>{children}</>
}

export const WindowViewport = ({ children }: WithChildren) => {
  return (
    <Subscribe source$={windows$}>
      <WindowViewportComponent>{children}</WindowViewportComponent>
    </Subscribe>
  )
}
