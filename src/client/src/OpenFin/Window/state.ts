import { createSignal } from "@react-rxjs/utils"
import { merge, scan } from "rxjs"

import {
  creditTemplateLayouts,
  CreditView,
  fxTemplateLayouts,
  FxView,
} from "../utils/templates"
import {
  RT_CREDIT_MAIN_WINDOW_NAME,
  RT_FX_MAIN_WINDOW_NAME,
} from "../utils/window"

export const CLOSING_WINDOW = "closing-window"

export const OPENING_WINDOW = "opening-window"

interface Window {
  name: string
  view?: FxView | CreditView
}

type WindowState = Record<string, CreditView | FxView>

type WindowEvent = {
  window: Window
  type: typeof OPENING_WINDOW | typeof CLOSING_WINDOW
}

const [windowEvents$, registerWindowEvent] = createSignal<WindowEvent>()

const fxLayouts = {
  [FxView.Analytics]: fxTemplateLayouts.tilesBlotter,
  [FxView.Tiles]: fxTemplateLayouts.blotterAnalytics,
  [FxView.FxBlotter]: fxTemplateLayouts.tilesAnalytics,
}

const fxViews = Object.values(FxView)

const creditLayouts = {
  [CreditView.CreditBlotter]: creditTemplateLayouts.rfqsNewRfq,
  [CreditView.RFQS]: creditTemplateLayouts.blotterNewRfq,
  [CreditView.NewRFQ]: creditTemplateLayouts.blotterRfqs,
}

const creditViews = Object.values(CreditView)

export { registerWindowEvent }

const getPoppedOutView = <T>(
  view: T,
  closedView: T,
  mainWindowViews: OpenFin.View[],
) =>
  ![closedView, ...mainWindowViews.map((view) => view.identity.name)].includes(
    view,
  )

const getCreditWindowLayout = (
  closedView: CreditView,
  mainWindowViews: OpenFin.View[],
) => {
  const poppedOutView = creditViews.find((view) =>
    getPoppedOutView(view, closedView, mainWindowViews),
  )
  return poppedOutView
    ? creditLayouts[poppedOutView]
    : creditTemplateLayouts.main
}

const getFxWindowLayout = (
  closedView: FxView,
  mainWindowViews: OpenFin.View[],
) => {
  const poppedOutView = fxViews.find((view) =>
    getPoppedOutView(view, closedView, mainWindowViews),
  )
  return poppedOutView ? fxLayouts[poppedOutView] : fxTemplateLayouts.main
}

const replaceLayout = (closedView: FxView | CreditView) => {
  const isClosedViewFx = closedView in fxLayouts
  const windowName = isClosedViewFx
    ? RT_FX_MAIN_WINDOW_NAME
    : RT_CREDIT_MAIN_WINDOW_NAME

  fin.Window.wrap({
    name: windowName,
    uuid: fin.me.uuid,
  })
    .then((mainWindow) => mainWindow.getCurrentViews())
    .then((mainWindowViews) => {
      if (closedView) {
        const layout = fin.Platform.Layout.wrapSync({
          name: windowName,
          uuid: fin.me.uuid,
        })

        layout.replace(
          isClosedViewFx
            ? getFxWindowLayout(closedView as FxView, mainWindowViews)
            : getCreditWindowLayout(closedView as CreditView, mainWindowViews),
        )
      }
    })
}

const closeSpotTiles = (openWindows: WindowState) => {
  const tileWindowEntries = Object.entries(openWindows).filter(([name]) =>
    name.includes(`${RT_FX_MAIN_WINDOW_NAME}--Tile`),
  )

  tileWindowEntries.forEach(([windowName]) => {
    fin.Window.wrap({
      name: windowName,
      uuid: fin.me.uuid,
    }).then((window) => window.close())
  })

  //return the open windows without the tile windows
  return Object.fromEntries(
    Object.entries(openWindows).filter(
      ([name]) => !tileWindowEntries.map(([name]) => name).includes(name),
    ),
  )
}

const updateWindowState = {
  [CLOSING_WINDOW]: (windows: WindowState, event: WindowEvent) => {
    const { [event.window.name]: closedView, ...rest } = windows
    let openWindows = rest
    if (closedView === FxView.Tiles) {
      //remove tile windows from openWindows
      openWindows = closeSpotTiles(openWindows)
    }
    replaceLayout(closedView)
    return openWindows
  },

  [OPENING_WINDOW]: (windows: WindowState, event: WindowEvent) => {
    return {
      ...windows,
      [event.window.name]: event.window.view as CreditView | FxView,
    }
  },
}

export const windows$ = merge(windowEvents$).pipe(
  scan(
    (windows, event) => updateWindowState[event.type](windows, event),
    {} as WindowState,
  ),
)
