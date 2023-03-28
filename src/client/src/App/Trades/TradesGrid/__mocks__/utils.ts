export const convertRemToPixels = (rem: number) => rem * 16
export const getWidthPercentage = (widths: number[], width: number) =>
  width / (widths.reduce((acc, curr) => acc + curr) / 100)
