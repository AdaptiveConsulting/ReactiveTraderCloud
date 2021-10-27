import { BASE_URL, DOMAIN } from "@/constants"

export const constructUrl = (path: string): string =>
  `${DOMAIN}${BASE_URL}${path}`
