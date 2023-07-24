import { ExitCode } from "@openfin/core/src/OpenFin"
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { App, getCurrentSync } from "@openfin/workspace-platform"
import { delay, firstValueFrom, of, Subject, switchMap } from "rxjs"

import { ExecuteTradeRequest } from "@/generated/TradingGateway"
import { createCreditRfq } from "@/services/creditRfqRequests"
import { execute$ } from "@/services/executions"
import { deletePage, getPage, launchPage } from "@/workspace/browser"
import { getUserResult, getUserToSwitch, switchUser } from "@/workspace/user"

import { getNlpResults } from "./nlpProvider"
import {
  ADAPTIVE_LOGO,
  getAppsAndPages,
  HOME_ACTION_DELETE_PAGE,
} from "./utils"

export const executing$ = new Subject<ExecuteTradeRequest>()

// Must return a promise to execute properly from the context of CLIProvider.onSelection
export const execute = async (execution: ExecuteTradeRequest) => {
  executing$.next(execution)
  return firstValueFrom(
    of(null).pipe(
      delay(2000),
      switchMap(() => execute$(execution)),
    ),
  )
}

const PROVIDER_ID = "adaptive-home-provider"

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
      await getNlpResults(query, request, response)

      if (query.trim() === "/switch user") {
        return {
          results: [getUserResult(getUserToSwitch())],
        }
      }

      return { results: [loadingResult] }
    }

    return getAppsAndPages(query.length < queryMinLength ? undefined : query)
  }

  const handlePageSelection = async (result: CLIDispatchedSearchResult) => {
    if (result.action.name === HOME_ACTION_DELETE_PAGE) {
      await deletePage(result.data.pageId)
      if (lastResponse !== undefined && lastResponse !== null) {
        lastResponse.revoke(result.key)
      }
    } else {
      const pageToLaunch = await getPage(result.data.pageId)
      await launchPage(pageToLaunch)
    }
  }

  const handleAppSelection = async (appEntry: App) => {
    switch (appEntry.manifestType) {
      case "external": {
        try {
          const data = await fin.System.launchExternalProcess({
            alias: appEntry.manifest,
            listener: (result: ExitCode) => {
              console.log("the exit code", result.exitCode)
            },
          })

          console.info("Process launched: ", data)
        } catch (e: any) {
          console.error("Process launch failed: ", e)
        }

        break
      }

      case "trade-execution": {
        if (lastResponse !== undefined && lastResponse !== null) {
          const {
            currencyPair,
            spotRate,
            valueDate,
            direction,
            notional,
            dealtCurrency,
          } = appEntry as any

          console.log("Action on execute", appEntry)

          await execute({
            currencyPair,
            spotRate,
            valueDate,
            direction,
            notional,
            dealtCurrency,
          })
        }

        break
      }

      case "rfq-execution": {
        if (lastResponse !== undefined && lastResponse !== null) {
          const { instrumentId, quantity, direction } = appEntry as any
          await createCreditRfq({
            instrumentId,
            quantity,
            direction,
            expirySecs: 120,
          })
        }
        break
      }

      case "switch-user": {
        switchUser()

        const userToSwitch = getUserToSwitch()

        if (lastResponse !== undefined && lastResponse !== null) {
          lastResponse.respond([getUserResult(userToSwitch)])
        }
        break
      }

      case "url": {
        const platform = getCurrentSync()

        platform.createView({
          url: appEntry.manifest,
          bounds: { width: 320, height: 180 },
        } as any)

        break
      }

      default: {
        const platform = getCurrentSync()

        await platform.launchApp({ app: appEntry })
      }
    }
  }

  const onSelection = async (result: CLIDispatchedSearchResult) => {
    if (result.data !== undefined) {
      if (result.data.pageId !== undefined) {
        await handlePageSelection(result)
      } else {
        await handleAppSelection(result.data)
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
