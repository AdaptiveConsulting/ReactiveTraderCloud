import { ROUTES_CONFIG } from "@/client/constants"
import { constructUrl } from "@/client/utils/constructUrl"

const settings = {
  blockedPopoutsThrowError: false,
  closePopoutsOnUnload: true,
  constrainDragToContainer: false,
  hasHeaders: true,
  popoutWholeStack: false,
  reorderEnabled: true,
  reorderOnTabMenuClick: true,
  responsiveMode: "always",
  selectionEnabled: true,
  showCloseIcon: false,
  showMaximiseIcon: false,
  showPopoutIcon: true,
  tabControlOffset: 10,
  tabOverlapAllowance: 0,
}
const tilesContent = [
  {
    type: "component",
    componentName: "view",
    contextMenu: true,
    componentState: {
      url: constructUrl(ROUTES_CONFIG["tiles"]),
      name: "Tiles",
    },
    isClosable: true,
    title: "FX Spot Tiles",
  },
]
const blotterContent = [
  {
    type: "component",
    componentName: "view",
    contextMenu: true,
    componentState: {
      url: constructUrl(ROUTES_CONFIG["blotter"]),
      name: "Blotter",
    },
    isClosable: true,
    title: "FX Blotter",
  },
]
const analyticsContent = [
  {
    type: "component",
    componentName: "view",
    contextMenu: true,
    componentState: {
      url: constructUrl(ROUTES_CONFIG["analytics"]),
      name: "Analytics",
    },
    isClosable: true,
    title: "FX Analytics",
  },
]

const createStack = (
  width: number,
  height: number,
  content: Array<Record<string, unknown>>,
) => {
  return {
    type: "stack",
    width: width,
    height: height,
    isClosable: true,
    title: "",
    activeItemIndex: 0,
    content: content,
  }
}
export const mainLayout = {
  settings: settings,
  content: [
    {
      type: "row",
      id: "mainRow",
      isClosable: true,
      contextMenu: true,
      title: "",
      content: [
        {
          type: "column",
          isClosable: true,
          title: "",
          width: 80,
          content: [
            createStack(73, 50, tilesContent),
            createStack(73, 50, blotterContent),
          ],
        },
        createStack(30, 100, analyticsContent),
      ],
    },
  ],
}

export const blotterAnalyticsLayout = {
  settings: settings,
  content: [
    {
      type: "row",
      id: "mainRow",
      isClosable: true,
      contextMenu: true,
      title: "",
      content: [
        {
          type: "column",
          isClosable: true,
          title: "",
          width: 80,
          content: [createStack(73, 100, blotterContent)],
        },
        createStack(30, 100, analyticsContent),
      ],
    },
  ],
}

export const tilesAnalyticsLayout = {
  settings: settings,
  content: [
    {
      type: "row",
      id: "mainRow",
      isClosable: true,
      contextMenu: true,
      title: "",
      content: [
        {
          type: "column",
          isClosable: true,
          title: "",
          width: 80,
          content: [createStack(73, 100, tilesContent)],
        },
        createStack(30, 100, analyticsContent),
      ],
    },
  ],
}

export const tilesBlotterLayout = {
  settings: settings,
  content: [
    {
      type: "row",
      id: "mainRow",
      isClosable: true,
      contextMenu: true,
      title: "",
      content: [
        {
          type: "column",
          isClosable: true,
          title: "",
          width: 100,
          content: [
            createStack(100, 50, tilesContent),
            createStack(100, 50, blotterContent),
          ],
        },
      ],
    },
  ],
}
