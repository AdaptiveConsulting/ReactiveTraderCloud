import { ROUTES_CONFIG } from "@/constants"
import { constructUrl } from "@/utils/url"

import {
  createLayoutContent,
  createStack,
  createViewContent,
  settings,
} from "./shared"

export enum FxView {
  Tiles = "Tiles",
  FxBlotter = "FX-Blotter",
  Analytics = "Analytics",
}

const viewContent = {
  tiles: createViewContent("Spot Tiles", {
    url: constructUrl(ROUTES_CONFIG["tiles"]),
    name: FxView.Tiles,
  }),
  blotter: createViewContent("FX-Blotter", {
    url: constructUrl(ROUTES_CONFIG["blotter"]),
    name: FxView.FxBlotter,
  }),
  analytics: createViewContent("Analytics", {
    url: constructUrl(ROUTES_CONFIG["analytics"]),
    name: FxView.Analytics,
  }),
}

const main = {
  settings,
  content: createLayoutContent([
    {
      type: "column",
      isClosable: true,
      title: "",
      width: 80,
      content: [
        createStack({ height: 50, content: viewContent.tiles }),
        createStack({ content: viewContent.blotter }),
      ],
    },
    createStack({ width: 30, content: viewContent.analytics }),
  ]),
}

const blotterAnalytics = {
  settings,
  content: createLayoutContent([
    {
      type: "column",
      isClosable: true,
      title: "",
      width: 80,
      content: [createStack({ height: 50, content: viewContent.blotter })],
    },
    createStack({ width: 30, content: viewContent.analytics }),
  ]),
}

const tilesAnalytics = {
  settings,
  content: createLayoutContent([
    {
      type: "column",
      isClosable: true,
      title: "",
      width: 80,
      content: [createStack({ height: 50, content: viewContent.tiles })],
    },
    createStack({ width: 30, content: viewContent.analytics }),
  ]),
}

const tilesBlotter = {
  settings,
  content: createLayoutContent([
    createStack({ height: 50, content: viewContent.tiles }),
    createStack({ content: viewContent.blotter }),
  ]),
}

export const fxTemplateLayouts = {
  main,
  blotterAnalytics,
  tilesAnalytics,
  tilesBlotter,
}
