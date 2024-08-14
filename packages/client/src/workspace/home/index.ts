import {
  CLIDispatchedSearchResult,
  CLIProvider,
  CLISearchListenerRequest,
  CLISearchListenerResponse,
  CLISearchResponse,
  CLITemplate,
  Home,
  HomeRegistration,
} from "@openfin/workspace"
import { createSignal } from "@react-rxjs/utils"
import { withLatestFrom } from "rxjs"

import { nlpIntent$, setInput } from "@/services/nlp"
import { deletePage, getPage, launchPage } from "@/workspace/browser"
import { getUserResult, getUserToSwitch } from "@/workspace/user"

import { respondWithIntent as respond } from "./respondWithIntent"
import {
  ADAPTIVE_LOGO,
  getAppsAndPages,
  handleAppSelection,
  HOME_ACTION_DELETE_PAGE,
  PageData,
} from "./utils"

const PROVIDER_ID = "adaptive-home-provider"

const [requestResponse$, setRequestResponse] = createSignal<{
  request: CLISearchListenerRequest
  response: CLISearchListenerResponse
}>()

nlpIntent$
  .pipe(withLatestFrom(requestResponse$))
  .subscribe(([intent, { request, response }]) => {
    if (intent !== "loading") {
      respond(intent, response, request)
    }
  })

export async function registerHome(): Promise<HomeRegistration> {
  const queryMinLength = 3
  const loadingResult = {
    key: "loading",
    title: "Searching...",
    data: {},
    icon: ADAPTIVE_LOGO,
    actions: [],
    template: CLITemplate.Plain,
  }
  let lastResponse: CLISearchListenerResponse

  const onUserInput = async (
    request: CLISearchListenerRequest,
    response: CLISearchListenerResponse,
  ): Promise<CLISearchResponse> => {
    const query = request.query.toLowerCase()

    // Open this response so we can start pushing results
    response.open()
    request.onClose(() => {
      response.close()
    })

    // Keep reference to lastResponseso we can revoke a page if user deletes it from search results
    if (lastResponse !== undefined) {
      lastResponse.close()
    }
    lastResponse = response
    lastResponse.open()

    if (query.indexOf("/") === 0) {
      setRequestResponse({ request, response })
      setInput(query)

      if (query.trim() === "/switch user") {
        return {
          results: [getUserResult(getUserToSwitch())],
        }
      }

      return { results: [loadingResult] }
    }

    return getAppsAndPages(query.length < queryMinLength ? undefined : query)
  }

  type PageSearchResult = Omit<CLIDispatchedSearchResult, "data"> & {
    data: PageData
  }

  const handlePageSelection = async (result: PageSearchResult) => {
    if (result.action.name === HOME_ACTION_DELETE_PAGE) {
      await deletePage(result.data.pageId)
      if (lastResponse !== undefined && lastResponse !== null) {
        lastResponse.revoke(result.key)
      }
    } else {
      const pageToLaunch = await getPage(result.data.pageId)
      if (pageToLaunch) {
        await launchPage(pageToLaunch)
      } else {
        console.warn(`No page found for ${result.data.pageId}`)
      }
    }
  }

  const isPageData = (
    data: CLIDispatchedSearchResult["data"],
  ): data is PageData => (data as PageData).pageId !== undefined

  const onSelection = async (result: CLIDispatchedSearchResult) => {
    if (result.data !== undefined) {
      if (isPageData(result.data)) {
        await handlePageSelection(result as PageSearchResult)
      } else {
        await handleAppSelection(result.data, lastResponse)
      }
    } else {
      console.warn("Unable to execute result without data being passed")
    }
  }

  const cliProvider: CLIProvider = {
    title: "Adaptive Workspace",
    id: PROVIDER_ID,
    icon: ADAPTIVE_LOGO,
    onUserInput: onUserInput,
    onResultDispatch: onSelection,
  }

  return Home.register(cliProvider)
}

export async function showHome() {
  return Home.show()
}

export async function deregisterHome() {
  return Home.deregister(PROVIDER_ID)
}
