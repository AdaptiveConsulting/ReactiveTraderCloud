import { App, getCurrentSync } from '@openfin/workspace-platform'
import {
  Home,
  CLIProvider,
  CLISearchListenerRequest,
  CLITemplate,
  CLISearchListenerResponse,
  CLISearchResponse,
  CLIDispatchedSearchResult
} from '@openfin/workspace'
import { BASE_URL } from '../consts'
import { deletePage, getPage, launchPage } from '../browser'
import { getAppsAndPages, getNlpResults, HOME_ACTION_DELETE_PAGE } from './utils'
import { execute } from '../services/executions'

const PROVIDER_ID = 'adaptive-home-provider'

export async function registerHome(): Promise<void> {
  const queryMinLength = 3
  const loadingResult = {
    key: 'loading',
    title: 'Searching...',
    data: {},
    actions: [],
    template: CLITemplate.Plain
  }
  let lastResponse: CLISearchListenerResponse

  const onUserInput = async (
    request: CLISearchListenerRequest,
    response: CLISearchListenerResponse
  ): Promise<CLISearchResponse> => {
    let query = request.query.toLowerCase()

    if (query.indexOf('/') === 0) {
      return { results: [] }
    }

    if (query.length < queryMinLength) {
      return getAppsAndPages()
    }

    // Keep reference to lastResponseso we can revoke a page if user deletes it from search results
    if (lastResponse !== undefined) {
      lastResponse.close()
    }
    lastResponse = response
    lastResponse.open()

    // Open this response so we can start pushing results
    response.open()

    const appsAndPages = await getAppsAndPages(query)
    response.respond([loadingResult, ...appsAndPages.results])

    await getNlpResults(query, request, response)

    request.onClose(() => {
      response.close()
    })

    return {
      results: []
    }
  }

  const handlePageSelection = async (result: CLIDispatchedSearchResult) => {
    if (result.action.name === HOME_ACTION_DELETE_PAGE) {
      await deletePage(result.data.pageId)
      if (lastResponse !== undefined && lastResponse !== null) {
        lastResponse.revoke(result.key)
      }
    } else {
      let pageToLaunch = await getPage(result.data.pageId)
      await launchPage(pageToLaunch)
    }
  }

  const handleAppSelection = async (appEntry: App) => {
    if (appEntry.manifestType === 'external') {
      fin.System.launchExternalProcess({
        alias: appEntry.manifest,
        listener: (result: any) => {
          console.log('the exit code', result.exitCode)
        }
      })
        .then((data: any) => {
          console.info('Process launched: ', data)
        })
        .catch((e: any) => {
          console.error('Process launch failed: ', e)
        })
    } else if (appEntry.manifestType === 'trade-execution') {
      if (lastResponse !== undefined && lastResponse !== null) {
        const {
          currencyPair,
          spotRate,
          valueDate,
          direction,
          notional,
          dealtCurrency
        } = appEntry as any
        console.log('Action on execute', appEntry)

        await execute({
          currencyPair,
          spotRate,
          valueDate,
          direction,
          notional,
          dealtCurrency
        })
      }
    } else if (appEntry.manifestType === 'url') {
      let platform = getCurrentSync()
      platform.createView({ url: appEntry.manifest, bounds: { width: 320, height: 180 } } as any)
    } else {
      let platform = getCurrentSync()
      await platform.launchApp({ app: appEntry })
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
      console.warn('Unable to execute result without data being passed')
    }
  }

  const cliProvider: CLIProvider = {
    title: 'Adaptive Workspace',
    id: PROVIDER_ID,
    icon: `${BASE_URL}/images/icons/adaptive.png`,
    onUserInput: onUserInput,
    onResultDispatch: onSelection
  }

  return Home.register(cliProvider)
}

export async function showHome() {
  return Home.show()
}

export async function deregisterHome() {
  return Home.deregister(PROVIDER_ID)
}
