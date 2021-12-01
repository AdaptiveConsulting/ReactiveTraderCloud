import { BASE_PATH } from "@/constants"

export const constructUrl = (
  path: string,
  base = window.location.origin,
): string => {
  const baseUrl = `${base}${BASE_PATH}`
  if (baseUrl.endsWith("/") && path.startsWith("/")) {
    return `${baseUrl}${path.slice(1)}`
  }
  return `${baseUrl}${path}`
}
