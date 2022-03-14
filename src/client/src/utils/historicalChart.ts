import {
  curveCatmullRom,
  CurveFactory,
  CurveFactoryLineOnly,
  extent,
  line,
  scaleLinear,
  scaleTime,
} from "d3"

export type Range<T> = [T, T]
export type DatePoint = [Date, number]
export interface DatePoints {
  points: DatePoint[]
  xRange: Range<Date>
  yRange: Range<number>
}

export const getDataPoints = <T>(mapper: (x: T, idx: number) => DatePoint) => (
  arr: T[],
): DatePoints => {
  const points = arr.map(mapper)

  return {
    points,
    xRange: [points[0][0], points[points.length - 1][0]],
    yRange: extent(points.map(([_, y]) => y)).reverse() as [number, number],
  }
}

export const withScales = (xRange: Range<number>, yRange: Range<number>) => {
  const xScale = scaleTime().range(xRange)
  const yScale = scaleLinear().range(yRange)
  return (points: DatePoints) => ({
    ...points,
    xScale: xScale.domain(points.xRange),
    yScale: yScale.domain(points.yRange),
  })
}

export const toSvgPath = (
  curve: CurveFactory | CurveFactoryLineOnly = curveCatmullRom,
) => {
  const curvedLine = line<[Date, number]>().curve(curve)
  return ({
    xScale: x,
    yScale: y,
    points,
  }: {
    xScale: (x: Date) => number
    yScale: (x: number) => number
    points: DatePoint[]
  }) => curvedLine.x((d) => x(d[0])).y((d) => y(d[1]))(points)!
}
