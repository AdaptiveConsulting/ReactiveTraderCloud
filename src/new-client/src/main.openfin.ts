import { OpenFinApp } from "@/OpenFin"
import {
  Home,
  CLIProvider,
  CLISearchListenerRequest,
  CLISearchListenerResponse,
  CLISearchResponse,
  CLIDispatchedSearchResult,
  CLISearchResult,
  CLITemplate,
} from "@openfin/workspace"
import { map, take } from "rxjs/operators"
import { tearOut } from "./App/LiveRates/Tile/TearOut/state"
import { ROUTES_CONFIG } from "./constants"
import { CurrencyPair, currencyPairs$ } from "./services/currencyPairs"

export const gaDimension = "openfin"

const providerId = "reactive-trader-workspace-platform"

const getResults = async (query?: string): Promise<CLISearchResponse> => {
  const formattedQuery = query?.toLowerCase().trim()
  return currencyPairs$
    .pipe(
      map<Record<string, CurrencyPair>, CLISearchResponse>((data) => {
        console.log("inside map", data)
        const symbols = Object.keys(data)
        let results: CLISearchResult<any>[] = symbols
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
      take(1),
    )
    .toPromise()
}

export const getMainApp: () => React.FC = () => {
  if (window.location.pathname === ROUTES_CONFIG.tiles) {
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
      response: CLISearchListenerResponse,
    ): Promise<CLISearchResponse> => {
      let query = request.query.toLowerCase()
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

  return OpenFinApp
}
