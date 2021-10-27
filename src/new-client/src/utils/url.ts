import { BASE_URL } from "@/constants"

export const constructUrl = (path: string, base = BASE_URL): string => {
  if (base === "/") {
    return path
  }
  if (base.endsWith("/") && path.startsWith("/")) {
    return `${base}${path.slice(1)}`
  }
  return `${base}${path}`
}
