import { BASE_URL } from "@/constants"

// Construct a url with path appended to application's base url
export const constructUrl = (path: string): string => {
  const base = BASE_URL.endsWith("/")
    ? BASE_URL.slice(0, BASE_URL.length - 1)
    : BASE_URL
  return `${base}${path}`
}
