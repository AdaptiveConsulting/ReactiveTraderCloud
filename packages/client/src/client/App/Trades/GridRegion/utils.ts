//Using because react-window seems to warp flex values in its items
export const getWidthPercentage = (widths: number[], width: number) =>
  width / (widths.reduce((acc, curr) => acc + curr) / 100)

export const convertRemToPixels = (rem: number) =>
  rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
