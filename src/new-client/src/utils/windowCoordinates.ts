import { RefObject } from "react"

export interface Offset {
  y: number
  x: number
}

export const calculateWindowCoordinates = (
  ref: RefObject<HTMLDivElement | null>,
): Offset => {
  if (!ref || !ref.current) {
    return { x: 0, y: 0 }
  }
  const coords = ref.current.getBoundingClientRect()
  return { x: coords.left, y: coords.top }
}
