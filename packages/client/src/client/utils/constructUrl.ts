import { BASE_PATH } from "../constants"

export const constructUrl = (path: string): string => {
  const baseUrl = `${window.location.origin}${BASE_PATH}`

  if (baseUrl.endsWith("/") && path.startsWith("/")) {
    return `${baseUrl}${path.slice(1)}`
  }

  return `${baseUrl}${path}`
}
