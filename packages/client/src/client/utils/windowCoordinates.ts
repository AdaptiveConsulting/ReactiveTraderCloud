export interface Offset {
  y: number
  x: number
}

export const calculateWindowCoordinates = (ref?: HTMLDivElement): Offset => {
  if (!ref) {
    return { x: 0, y: 0 }
  }
  const coords = ref.getBoundingClientRect()
  return { x: coords.left, y: coords.top }
}
