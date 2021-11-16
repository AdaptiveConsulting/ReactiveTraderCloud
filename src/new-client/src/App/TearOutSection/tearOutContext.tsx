import { createContext } from "react"

type sectionTornOut = {
  isTornOut: boolean
}

export const sectionsTornOut: sectionTornOut = {
  isTornOut: false,
}

export const TearOutContext = createContext(sectionsTornOut)
