import _ from 'lodash'
import React, { Component } from 'react'

export interface Props {
  gap: number
  height: number
  width: number
  count?: number
  scale?: number
  radius?: number
  analyser?: AnalyserNode
}

interface State {
  grid: {
    width: number
    height: number
    gap: number
    style: {
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

export class FormantBars extends Component<Props, Partial<State>> {
  state: Partial<State> = {
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
    { data, bar, grid }: State,
  ) {
    let state = null

    if (analyser.frequencyBinCount !== data.length) {
      state = {
        ...(state as any),
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
            width: `${_.round((width / scale + gap / scale) * count - gap / scale)}px`,
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

  canvas: any
  canvasScale = 2
  frameID: any

  componentWillUnmount() {
    cancelAnimationFrame(this.frameID)
  }

  setCanvas = async (canvas: any) => {
    this.canvas = canvas

    cancelAnimationFrame(this.frameID)

    this.draw()
  }

  draw = () => {
    if (typeof this === 'undefined') {
      return
    } else {
      this.frameID = requestAnimationFrame(this.draw)
    }

    const {
      props: { analyser },
      state: { bar, grid },
      canvas,
    } = this

    let { data } = this.state

    analyser.getFloatFrequencyData(data)

    if (!Number.isFinite(data[0])) {
      return
    }

    // Move to positive integer
    data = data.map(v => v + 2 * (analyser.maxDecibels - analyser.minDecibels))

    // Reduce signal from treble and bass
    data = data.map(
      (current, i, { length }: any) =>
        // Weight the values with a moment at the midpoint
        // current * Math.sin((i / length) * Math.PI),
        0.2 * current + 0.8 * (current * Math.sin((i / length) * Math.PI)),
    )

    const max = _.max(data)
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
    data = _.chunk(data, Math.round(data.length / bar.count)).map((vs, i, c) => _.sum(vs) / vs.length) as any

    if (canvas && canvas.getContext) {
      const canvasCtx = canvas.getContext('2d')

      canvasCtx.clearRect(0, 0, grid.width, grid.height)

      data.forEach((value, i) => {
        const x = i * (bar.width + grid.gap)
        const magnitude = _.max([2 * value, 3 * bar.width])
        const height = _.min([magnitude, bar.height * 1.5])

        canvasCtx.fillStyle =
          'rgb(' + Math.floor((0.75 + Math.sin(Math.PI * (magnitude / 50))) * magnitude + 95 / 2) + ',148,245)'

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

  render() {
    return (
      <canvas
        ref={this.setCanvas}
        width={`${this.state.grid.width}px`}
        height={`${this.state.grid.height}px`}
        style={this.state.grid.style}
      />
    )
  }
}

export function roundRect({ ctx, x, y, width, height, radius, fill, stroke }: any) {
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
