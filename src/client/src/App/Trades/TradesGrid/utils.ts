//Using because react-window seems to warp flex values in its items
export const getWidthPercentage = (widths: number[], width: number) =>
  width / (widths.reduce((acc, curr) => acc + curr) / 100)

export function convertRemToPixels(rem: number) {
  return process.env.NODE_ENV !== "test"
    ? rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
    : rem * 16
}
