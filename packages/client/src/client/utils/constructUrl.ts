import { BASE_URL } from "../constants"

export const constructUrl = (
  path: string,
  base = window.location.origin,
): string => {
  //removing workspace dir from workspace base path
  // const basePathSections = BASE_PATH.split("/")
  // const lastSection = basePathSections.pop()
  // const basePath =
  //   lastSection === "workspace" ? basePathSections.join("/") : BASE_PATH

  if (BASE_URL.endsWith("/") && path.startsWith("/")) {
    return `${BASE_URL}${path.slice(1)}`
  }
  return `${BASE_URL}${path}`
}
