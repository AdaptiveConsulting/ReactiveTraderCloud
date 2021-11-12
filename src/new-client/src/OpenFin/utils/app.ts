import { ENVIRONMENT } from "@/constants"

export function getAppName(name: string = "Reactive Trader®"): string {
  const envFormatted =
    ENVIRONMENT === "prod" ? "" : ` (${ENVIRONMENT.toUpperCase()})`

  return `${name}${envFormatted}`
}

/**
 * Gets the title of the first `content` element of the current Platform Layout
 */
export async function getPlatformLayoutTitle(): Promise<string | undefined> {
  const layout = fin.Platform.Layout.getCurrentSync()
  const config = await layout.getConfig()
  return config.content?.[0].title
}
