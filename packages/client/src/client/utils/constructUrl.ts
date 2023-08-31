import { BASE_PATH } from "client/constants"

export const constructUrl = (
  path: string,
  base = window.location.origin,
): string => {
  const baseUrl = `${base}${BASE_PATH}`
  console.log("path:", path)
  console.log("window.location.origin", window.location.origin)
  console.log("base path", BASE_PATH)
  if (baseUrl.endsWith("/") && path.startsWith("/")) {
    return `${baseUrl}${path.slice(1)}`
  }
  return `${baseUrl}${path}`
}
