import _, { clamp, chunk } from 'lodash'
import React, { Component } from 'react'

export interface Props {
  gap: number
  height: number
  width: number
  analyser: AnalyserNode
  count: number
  scale: number
  radius: number
  color: (magnitude: number) => string | null
}

interface State {
  grid: {
    width: number
    height: number
    gap: number
    style?: {
      width: string
      height: string
    }
  }
  bar: {
    width: number
    height: number
    radius: number
    count: number
  }
  data: Float32Array
}

class FormantBars extends Component<Props, State> {
  state: State = {
    grid: {
      width: 0,
      height: 0,
      gap: 0,
    },
    bar: {
      width: 0,
      height: 0,
      radius: 0,
      count: 0,
    },
    data: new Float32Array(),
  }

  static defaultProps = {
    gap: 2,
    width: 4,
    height: 32,
    radius: 2,
    count: 8,
    scale: 2,
  }

  static getDerivedStateFromProps(
    { analyser, count, scale, width, height, radius, gap }: Props,
    { data, bar }: State,
  ) {
    let state = {}

    if (analyser.frequencyBinCount !== data.length) {
      state = {
        ...state,
        data: new Float32Array(analyser.frequencyBinCount),
      }
    }

    if (bar == null) {
      ;[width, height, radius, gap] = [width, height, radius, gap].map(v => v * scale)

      state = {
        ...state,

        grid: {
          width: (width + gap) * count - gap,
          height,
          gap,
          style: {
            width: `${Math.round((width / scale + gap / scale) * count - gap / scale)}px`,
            height: `${height / scale}px`,
          },
        },

        bar: {
          width,
          height,
          radius,
          count,
        },
      }
    }

    return state
  }

  canvas: HTMLCanvasElement | null = null
  frameID: number = 0
  canvasScale = 2

  componentWillUnmount() {
    cancelAnimationFrame(this.frameID)
  }

  componentDidMount = () => {
    this.canvas = this.canvasRef.current

    cancelAnimationFrame(this.frameID)

    this.draw()
  }

  canvasRef = React.createRef<HTMLCanvasElement>()

  draw = () => {
    if (typeof this === 'undefined') {
      return
    } else {
      this.frameID = requestAnimationFrame(this.draw)
    }

    const {
      props: { analyser, color },
      state: { bar, grid },
      canvas,
    } = this

    let { data } = this.state

    analyser.getFloatFrequencyData(data)

    if (!Number.isFinite(data[0])) {
      return
    }

    // Move to positive integer
    data = data.map(v => clamp(v + 2 * (analyser.maxDecibels - analyser.minDecibels), 0, 255))

    // Reduce signal from treble and bass
    data = data.map(
      (current, i, { length }) =>
        // Weight the values with a moment at the midpoint
        // current * Math.sin((i / length) * Math.PI),
        0.2 * current + 0.8 * (current * Math.sin((i / length) * Math.PI)),
    )

    const max = Math.max(...Array.prototype.slice.call(data))
    const maxDb = analyser.maxDecibels - analyser.minDecibels
    // const maxDb = (1 - 1 / bar.count) * (analyser.maxDecibels - analyser.minDecibels)
    data = data.map(
      v =>
        1 +
        // Original
        0.25 * v +
        // Relative to maxiumum decibel expected
        0.25 * v * (maxDb / max) +
        // Relative to current maximum
        0.5 * v * (v / max),
    )

    // data = _.chunk(data, 2).map(([a, b], i, c) => (a + b) / 2) as any
    // @ts-ignore
    data = chunk(data, Math.round(data.length / bar.count)).map((vs, i, c) => _.sum(vs) / vs.length)

    if (canvas && canvas.getContext) {
      const canvasCtx: CanvasRenderingContext2D | null = canvas.getContext('2d')
      if (canvasCtx) {
        canvasCtx.clearRect(0, 0, grid.width, grid.height)
        data.forEach((value, i) => {
          const x = i * (bar.width + grid.gap)
          const magnitude = Math.max(2 * value, 3 * bar.width)
          const height = Math.min(magnitude, bar.height * 1.5)

          canvasCtx.fillStyle =
            (color && color(clamp(magnitude / 200, 0, 1))) ||
            'rgb(' +
              Math.floor((0.75 + Math.sin(Math.PI * (magnitude / 50))) * magnitude + 95 / 2) +
              ',148,245)'

          roundRect({
            ctx: canvasCtx,
            x,
            y: grid.height / 2 - height / 4,
            width: bar.width,
            height: height / 2,
            radius: this.state.bar.radius,
            fill: true,
            stroke: false,
          })
        })
      }
    }
  }

  render() {
    return (
      <canvas
        ref={this.canvasRef}
        width={`${this.state.grid.width}px`}
        height={`${this.state.grid.height}px`}
        style={this.state.grid.style}
      />
    )
  }
}

interface RoundRectInputs {
  ctx: CanvasRenderingContext2D
  x: number
  y: number
  width: number
  height: number
  radius: number | { tl: number; tr: number; br: number; bl: number }
  fill: boolean
  stroke: boolean
}

export function roundRect({ ctx, x, y, width, height, radius, fill, stroke }: RoundRectInputs) {
  if (typeof stroke === 'undefined') {
    stroke = true
  }
  if (typeof radius === 'undefined') {
    radius = 4
  }

  if (typeof radius === 'number') {
    radius = { tl: radius, tr: radius, br: radius, bl: radius }
  } else {
    radius = {
      ...{ tl: 0, tr: 0, br: 0, bl: 0 },
      ...radius,
    }
  }

  ctx.beginPath()
  ctx.moveTo(x + radius.tl, y)
  ctx.lineTo(x + width - radius.tr, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr)
  ctx.lineTo(x + width, y + height - radius.br)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height)
  ctx.lineTo(x + radius.bl, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl)
  ctx.lineTo(x, y + radius.tl)
  ctx.quadraticCurveTo(x, y, x + radius.tl, y)
  ctx.closePath()
  if (fill) {
    ctx.fill()
  }
  if (stroke) {
    ctx.stroke()
  }
}

export default FormantBars
export { FormantBars }
