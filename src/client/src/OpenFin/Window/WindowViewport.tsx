import { WindowEvent } from "@openfin/core/src/api/events/base"
import { useEffect } from "react"

import { WithChildren } from "@/utils/utilityTypes"

import { mainOpenFinWindowName } from "../utils/window"
import tileWindowNames from "@/OpenFin/utils/tileWindowNames"

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

const closeTileWindows = async () => {
  const childWindowNames = (
    await fin.Application.getCurrentSync().getChildWindows()
  ).map((window) => window.identity.name)
  const openTiles = childWindowNames.filter((windowName) =>
    tileWindowNames.has(windowName),
  )
  openTiles.forEach((tileName) => {
    const tileWindow = fin.Window.wrapSync({
      uuid: fin.me.uuid,
      name: tileName,
    })
    tileWindow.close()
  })
}

export const WindowViewport = ({ children }: WithChildren) => {
  //TODO: Remove this HACK once OpenFin exposes content of "empty" layout containers...
  useEffect(() => {
    if (!fin.me.isView) {
      const listenerViewAttached = (
        _: WindowEvent<"window", "view-attached">,
      ) => {
        //const label: string = ((e || {}).viewIdentity || {}).name || "unknown"
        // ReactGA.event({ category: "RT - Tab", action: "attach", label })
        const viewName = e.viewIdentity.name
        switch (viewName) {
          case "Tiles":
            setTilesPoppedOut(false)
            // console.warn("tile view attached!\nopen tiles: ", openTiles)
            closeTileWindows()
            break
          case "Blotter":
            setBlotterPoppedOut(false)
            break
          case "Analytics":
            setAnalyticsPoppedOut(false)
            break
        }
        setNumPoppedOutSections(numPoppedOutSections - 1)
        // console.warn(
        //   "view attached!\npoppedoutSections: ",
        //   numPoppedOutSections,
        // )
      }

      const listenerViewDetached = (
        _: WindowEvent<"window", "view-detached">,
      ) => {
        //const label: string = ((e || {}).viewIdentity || {}).name || "unknown"
        // ReactGA.event({ category: "RT - Tab", action: "detach", label })
        const viewName = e.viewIdentity.name
        switch (viewName) {
          case "Tiles":
            setTilesPoppedOut(true)
            break
          case "Blotter":
            setBlotterPoppedOut(true)
            break
          case "Analytics":
            setAnalyticsPoppedOut(true)
            break
        }
        setNumPoppedOutSections(numPoppedOutSections + 1)
        // console.warn(
        //   "view detached!\npoppedoutSections: ",
        //   numPoppedOutSections,
        // )
        // focus the view so it doesn't go behind the main window on popout
        const view = fin.View.wrapSync({ uuid: fin.me.uuid, name: viewName })
        await view.focus()
      }

      const listenerViewDestroyed = (e: any) => {
        //const label: string = ((e || {}).viewIdentity || {}).name || "unknown"
        // ReactGA.event({ category: "RT - Tab", action: "detach", label })
        console.warn(
          "view destroyed!\npoppedoutSections: ",
          numPoppedOutSections,
        )
      }

      const listenerViewHidden = (
        _: WindowEvent<"application", "view-hidden">,
      ) => {
        const layoutItems: HTMLCollectionOf<Element> =
          document.getElementsByClassName("lm_item")
        for (const idx in layoutItems) {
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

      const listenerWindowCreated = (
        _: WindowEvent<"application", "window-created">,
      ) => {
        //const label: string = (e || {}).name || "unknown"
        // ReactGA.event({ category: "RT - Window", action: "open", label })
        // console.warn("window created!\nwindow: ", e, "\n")
      }

      const listenerWindowClosed = (
        _: WindowEvent<"application", "window-closed">,
      ) => {
        //const label: string = (e || {}).name || "unknown"
        // ReactGA.event({ category: "RT - Window", action: "close", label })
        const windowName = e.name
        if (tileWindowNames.has(windowName)) return
        const layout = fin.Platform.Layout.wrapSync({
          name: mainOpenFinWindowName,
          uuid: fin.me.uuid,
        })
        if (numPoppedOutSections == 1) layout.replace(mainLayout)
        else {
          // this solution only works if the child window of the other popped out section is the last one in the list of child windows
          const childWindows =
            await fin.Application.getCurrentSync().getChildWindows()
          const otherSectionWindow = childWindows.pop()
          const views = (await otherSectionWindow?.getCurrentViews()) || []
          const view = views[0]
          const otherPoppedOutSection = view.identity.name
          // console.warn(
          //   "window closed!\npoppedoutsections: ",
          //   numPoppedOutSections,
          //   "\nwindow: ",
          //   e,
          //   "\nother popped out section: ",
          //   otherPoppedOutSection,
          //   "\ntilesPoppedOut: ",
          //   tilesPoppedOut,
          //   "\nblotterPoppedOut: ",
          //   blotterPoppedOut,
          //   "\nanalyticsPoppedOut: ",
          //   analyticsPoppedOut,
          // )
          if (tilesPoppedOut && blotterPoppedOut) {
            if (otherPoppedOutSection === "Tiles") {
              layout.replace(blotterAnalyticsLayout)
            } else {
              layout.replace(tilesAnalyticsLayout)
            }
          } else if (tilesPoppedOut && analyticsPoppedOut) {
            if (otherPoppedOutSection === "Tiles") {
              layout.replace(blotterAnalyticsLayout)
            } else {
              layout.replace(tilesBlotterLayout)
            }
          } else if (blotterPoppedOut && analyticsPoppedOut) {
            if (otherPoppedOutSection === "Blotter") {
              layout.replace(tilesAnalyticsLayout)
            } else {
              layout.replace(tilesBlotterLayout)
            }
          }
        }
      }

      const listenerWindowClosing = ({
        name,
        uuid,
      }: WindowEvent<"application", "window-closing">) => {
        //const label: string = (e || {}).name || "unknown"
        // ReactGA.event({ category: "RT - Window", action: "closing", label })
        fin.Window.wrap({ uuid, name }).then((closingWindow) => {
          if (name === "Limit-Checker") {
            fin.me.interop.setContext({
              type: "limit-checker-status",
              id: { isAlive: "false" },
            })
          }
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
