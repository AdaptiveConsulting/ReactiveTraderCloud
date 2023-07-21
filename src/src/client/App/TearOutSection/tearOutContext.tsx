import { createContext } from "react"

type TearOutContextType = {
  isTornOut: boolean
}

export const initialTearOutContext: TearOutContextType = {
  isTornOut: false,
}

export const TearOutContext = createContext<TearOutContextType>(
  initialTearOutContext,
)
