/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CLIDispatchedSearchResult,
  CLIProvider,
  CLISearchListenerRequest,
  CLISearchResponse,
  CLISearchResult,
  CLITemplate,
  Home,
} from "@openfin/workspace"
import { firstValueFrom, map } from "rxjs"

import { tearOut } from "@/client/App/LiveRates/Tile/TearOut/state"
import { CurrencyPair, currencyPairs$ } from "@/services/currencyPairs"

const providerId = "reactive-trader-workspace-platform"

const getResults = async (query?: string): Promise<CLISearchResponse> => {
  const formattedQuery = query?.toLowerCase().trim()
  const results$ = currencyPairs$.pipe(
    map<Record<string, CurrencyPair>, CLISearchResponse>((data) => {
      const symbols = Object.keys(data)
      const results: CLISearchResult<any>[] = symbols
        .filter(
          (symbol) =>
            !formattedQuery || symbol.toLowerCase().includes(formattedQuery),
        )
        .map((symbol) => ({
          key: symbol,
          title: symbol,
          data: {
            appId: `reactive-trader-${symbol}`,
            manifestType: "symbol",
            manifest: symbol,
          },
          actions: [
            {
              name: "Launch Tile",
              hotkey: "enter",
            },
          ],
          description: `${symbol} live rate`,
          template: CLITemplate.SimpleText,
          templateContent: `${symbol} live rate`,
        }))

      return {
        results,
      }
    }),
  )
  return firstValueFrom(results$)
}

export const registerWorkspaceProvider = () => {
  fin.InterApplicationBus.subscribe(
    { uuid: "*" },
    "execute-trade",
    ({ symbol }: any) => {
      console.log("Execute trade requested", symbol)
      tearOut(symbol, true)
    },
  )

  console.log("Registering workspace provider", providerId)

  const queryMinLength = 3

  const onUserInput = async (
    request: CLISearchListenerRequest,
  ): Promise<CLISearchResponse> => {
    const query = request.query.toLowerCase()
    if (query.indexOf("/") === 0) {
      return { results: [] }
    }

    if (query.length < queryMinLength) {
      return getResults()
    }

    const { results } = await getResults(query)

    return {
      results,
    }
  }

  const onSelection = async (result: CLIDispatchedSearchResult) => {
    if (result.data !== undefined) {
      if (result.data.manifestType === "symbol") {
        tearOut(result.data.manifest, true)
      }
    } else {
      console.warn("Unable to execute result without data being passed")
    }
  }

  const cliProvider: CLIProvider = {
    title: "Reactive Trader Workspace",
    id: providerId,
    icon: "https://openfin.prod.reactivetrader.com/static/media/reactive-trader-icon-256x256.png",
    onUserInput: onUserInput,
    onResultDispatch: onSelection,
  }

  const deregister = () => {
    Home.deregister(providerId)
  }

  Home.register(cliProvider)
    .then(() => {
      console.log("Workspace provider registered")

      window.addEventListener("beforeunload", deregister)
    })
    .catch((e) => console.log("Error registering", e))
}
