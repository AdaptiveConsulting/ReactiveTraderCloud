import {
  Action,
  CLISearchResponse,
  CLISearchResult,
  CLITemplate,
} from "@openfin/workspace"
import { App, Page } from "@openfin/workspace-platform"

import { getApps } from "@/workspace/apps"
import { getPages } from "@/workspace/browser"

export const HOME_ACTION_DELETE_PAGE = "Delete Page"
export const HOME_ACTION_LAUNCH_PAGE = "Launch Page"

import { BASE_URL } from "../consts"
export const ADAPTIVE_LOGO = `${BASE_URL}/public-workspace/images/icons/adaptive.png`

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
  const apps = await getApps()
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
