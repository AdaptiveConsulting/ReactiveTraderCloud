/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExitCode } from "@openfin/core/src/OpenFin"
import {
  Action,
  CLISearchResponse,
  CLISearchResult,
  CLITemplate,
  SearchListenerResponse,
} from "@openfin/workspace"
import { App, getCurrentSync, Page } from "@openfin/workspace-platform"
import {
  delay,
  firstValueFrom,
  of,
  Subject,
  switchMap,
  tap,
  withLatestFrom,
} from "rxjs"

import {
  CreateRfqRequest,
  CreateRfqResponse,
  ExecuteTradeRequest,
} from "@/generated/TradingGateway"
import { createCreditRfq$, creditDealers$ } from "@/services/credit"
import { execute$ } from "@/services/executions"
import { getPages } from "@/workspace/browser"

import { BASE_URL } from "../constants"
import { getUserResult, getUserToSwitch, switchUser } from "../user"
import { getAllMainApps } from "../utils"

export const ADAPTIVE_LOGO = `${BASE_URL}/images/icons/adaptive.png`
export const HOME_ACTION_DELETE_PAGE = "Delete Page"
export const HOME_ACTION_LAUNCH_PAGE = "Launch Page"

const mapAppEntriesToSearchEntries = (apps: App[]): CLISearchResult<Action>[] =>
  apps.map((app) => {
    const entry: any = {
      key: app.appId,
      title: app.title,
      data: app,
      actions: [],
      template: CLITemplate.Plain,
    }
    const action = { name: "Launch View", hotkey: "enter" }

    if (app.manifestType === "view") {
      entry.label = "View"
      entry.actions = [action]
    }
    if (app.manifestType === "snapshot") {
      entry.label = "Snapshot"
      action.name = "Launch Snapshot"
      entry.actions = [action]
    }
    if (app.manifestType === "manifest") {
      entry.label = "App"
      action.name = "Launch App"
      entry.actions = [action]
    }
    if (app.manifestType === "external") {
      action.name = "Launch Native App"
      entry.actions = [action]
      entry.label = "Native App"
    }

    if (Array.isArray(app.icons) && app.icons.length > 0) {
      entry.icon = app.icons[0].src
    }

    if (app.description !== undefined) {
      entry.description = app.description
      entry.shortDescription = app.description
      entry.template = CLITemplate.SimpleText
      entry.templateContent = app.description
    }

    return entry
  })

const mapPageEntriesToSearchEntries = (
  pages: Page[],
): CLISearchResult<Action>[] =>
  pages.map((page) => {
    const entry: any = {
      key: page.pageId,
      title: page.title,
      label: "Page",
      actions: [
        { name: HOME_ACTION_DELETE_PAGE, hotkey: "CmdOrCtrl+D" },
        { name: HOME_ACTION_LAUNCH_PAGE, hotkey: "Enter" },
      ],
      data: { tags: ["page"], pageId: page.pageId },
      icon: ADAPTIVE_LOGO,
      template: CLITemplate.Plain,
    }

    if (page.description !== undefined) {
      entry.description = page.description
      entry.shortDescription = page.description
      entry.template = CLITemplate.SimpleText
      entry.templateContent = page.description
    }

    return entry
  })

export const getAppsAndPages = async (
  query?: string,
): Promise<CLISearchResponse> => {
  const apps = await getAllMainApps()
  const pages = await getPages()

  const appSearchEntries = mapAppEntriesToSearchEntries(apps)
  const pageSearchEntries = mapPageEntriesToSearchEntries(pages)

  const initialResults: CLISearchResult<any>[] = [
    ...appSearchEntries,
    ...pageSearchEntries,
  ]

  if (query === undefined || query === null || query.length === 0) {
    return {
      results: initialResults,
    }
  }

  if (initialResults.length > 0) {
    const finalResults = initialResults.filter((entry) => {
      const targetValue = entry.title

      if (
        targetValue !== undefined &&
        targetValue !== null &&
        typeof targetValue === "string"
      ) {
        return targetValue.toLowerCase().indexOf(query) > -1
      }
      return false
    })

    return {
      results: finalResults,
    }
  } else {
    return {
      results: [],
    }
  }
}

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

export const rfqResponse$ = new Subject<CreateRfqResponse>()

export const createRfq = async (
  request: Omit<CreateRfqRequest, "dealerIds">,
) => {
  return firstValueFrom(
    of(null).pipe(
      withLatestFrom(creditDealers$),
      switchMap(([, dealers]) =>
        createCreditRfq$({
          ...request,
          dealerIds: dealers.map((dealer) => dealer.id),
        }),
      ),
      tap((response) => rfqResponse$.next(response)),
    ),
  )
}

export const handleAppSelection = async (
  appEntry: App,
  lastResponse: SearchListenerResponse,
) => {
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
        await createRfq({
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
