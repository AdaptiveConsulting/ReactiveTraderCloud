import { createContext } from "react"

export const sectionsTornOut = {
  isTornOut: false,
}

export const TearOutContext = createContext(sectionsTornOut)
