import { CreditView } from "./creditTemplateLayouts"
import { FxView } from "./fxTemplateLayouts"

export const settings = {
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

export const createViewContent = (
  title: string,
  componentState: { url: string; name: CreditView | FxView },
) => [
  {
    type: "component",
    componentName: "view",
    contextMenu: true,
    componentState,
    isClosable: true,
    title,
  },
]

export const createLayoutContent = (content: OpenFin.LayoutItemConfig[]) => [
  {
    type: "row",
    id: "mainRow",
    isClosable: true,
    contextMenu: true,
    title: "",
    content,
  },
]

export const createStack = (
  overrides: Partial<OpenFin.LayoutItemConfig>,
): OpenFin.LayoutItemConfig => ({
  type: "stack",
  isClosable: true,
  title: "",
  ...overrides,
})
