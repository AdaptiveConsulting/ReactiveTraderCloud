import OpenFin from "@openfin/core"
import {
  getCurrentSync,
  GlobalContextMenuOptionType,
  OpenGlobalContextMenuPayload,
  Page,
  WorkspacePlatformOverrideCallback,
} from "@openfin/workspace-platform"
import { getUserToSwitch, switchUser } from "./user"

export async function getPage(pageId: string) {
  let platform = getCurrentSync()
  return platform.Storage.getPage(pageId)
}

export async function getPages() {
  let platform = getCurrentSync()
  return platform.Storage.getPages()
}

export async function deletePage(pageId: string) {
  let platform = getCurrentSync()
  return platform.Storage.deletePage(pageId)
}

export async function launchPage(page: Page) {
  let platform = getCurrentSync()
  return platform.Browser.createWindow({
    workspacePlatform: {
      pages: [page],
    },
  })
}

export async function launchView(
  view: OpenFin.PlatformViewCreationOptions | string,
  targetIdentity?: OpenFin.Identity,
) {
  let platform = getCurrentSync()
  let viewOptions: OpenFin.PlatformViewCreationOptions

  if (typeof view === "string") {
    viewOptions = { url: view } as OpenFin.PlatformViewCreationOptions
  } else {
    viewOptions = view
  }

  return platform.createView(viewOptions, targetIdentity)
}

const SWITCH_USER_ID = "switch-user-id"

export const overrideCallback: WorkspacePlatformOverrideCallback = async (
  WorkspacePlatformProvider,
) => {
  class Override extends WorkspacePlatformProvider {
    openGlobalContextMenu(
      req: OpenGlobalContextMenuPayload,
      callerIdentity: any,
    ) {
      return super.openGlobalContextMenu(
        {
          ...req,
          template: [
            ...req.template,
            {
              label: `Switch User to '${getUserToSwitch()}''`,
              data: {
                type: GlobalContextMenuOptionType.Custom,
                action: {
                  id: SWITCH_USER_ID,
                },
              },
            },
          ],
        },
        callerIdentity,
      )
    }
  }
  return new Override()
}

export const customActions = {
  [SWITCH_USER_ID]: () => {
    console.log("Switching user from global context menu")
    switchUser()
  },
}
