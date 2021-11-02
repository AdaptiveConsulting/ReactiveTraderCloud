import { createContext, useContext } from "react"

const overlayContext = createContext<HTMLDivElement | null>(null)

export const OverlayProvider = overlayContext.Provider
export const useOverlayElement = () => useContext(overlayContext)
