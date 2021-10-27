import { BASE_URL } from "@/constants"

export const constructUrl = (path: string): string =>
  BASE_URL === "/" ? path : `${BASE_URL}${path}`
