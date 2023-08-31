import { BASE_PATH, ENVIRONMENT } from "client/constants"

export const constructUrl = (
  path: string,
  base = window.location.origin,
): string => {
  //removing workspace dir from workspace base path
  const basePathSections = BASE_PATH.split("/")
  const lastSection = basePathSections.pop()
  const basePath =
    lastSection === "workspace" ? basePathSections.join("/") : BASE_PATH

  //replace workspace port 2017 with openfin port 1917
  const baseUrl = `${base.replace("2017", "1917")}${basePath}`
  if (baseUrl.endsWith("/") && path.startsWith("/")) {
    return `${baseUrl}${path.slice(1)}`
  }
  return `${baseUrl}${path}`
}
