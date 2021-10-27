import { BASE_URL } from "@/constants"

export const constructUrl = (path: string): string => {
  if (BASE_URL === "/") {
    return path
  }
  if (BASE_URL.endsWith("/") && path.startsWith("/")) {
    return `${BASE_URL}${path.slice(1)}`
  }
  return `${BASE_URL}${path}`
}
