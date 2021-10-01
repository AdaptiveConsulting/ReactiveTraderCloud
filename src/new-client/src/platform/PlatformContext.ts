import { createContext, useContext } from "react"
import { Platform } from "./types"

export const PlatformContext = createContext<Platform>({
  type: "web",
})

export const usePlatform = () => useContext(PlatformContext)
