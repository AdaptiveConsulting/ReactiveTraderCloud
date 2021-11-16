import { createContext } from "react"

export const sections = {
  liverates: {
    isTornOut: false,
  },
  analytics: {
    isTornOut: false,
  },
  trades: {
    isTornOut: false,
  },
}

export const TearOutContext = createContext(sections.liverates)
