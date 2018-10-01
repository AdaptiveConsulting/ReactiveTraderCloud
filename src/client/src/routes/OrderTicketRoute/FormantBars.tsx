import _ from 'lodash'
import React, { Component } from 'react'
import { styled, Styled } from 'rt-theme'
import { Block } from '../StyleguideRoute/styled'

import FormantIcon from './assets/Formant'
import formantSVGURL from './assets/formant.svg'

import { faMicrophone } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import createSpeechRecognition from './createSpeechRecognition'

declare const MediaRecorder: any

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
            width: `${(width / scale + gap / scale) * count - gap / scale}px`,
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

  analyserData = new Float32Array(this.props.analyser.frequencyBinCount)

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
      props,
      props: { analyser },
      state: { bar, grid },
      canvas,
    } = this

    let { data } = this.state

    analyser.getFloatFrequencyData(data)

    if (!Number.isFinite(data[0])) {
      return console.log(data)
    }
    console.log(analyser.maxDecibels, analyser.minDecibels, analyser.maxDecibels - analyser.minDecibels)

    data = data
      // .map(v => v * (1 / (analyser.maxDecibels - analyser.minDecibels)) * bar.height)
      .map(v => v + 2 * (analyser.maxDecibels - analyser.minDecibels))
      .map(
        (
          current,
          i,
          {
            length,
            [(length / 2).toFixed()]: middle,
            [0]: first,
            [length - 1]: last,
            [i + 1]: next = current,
            [i - 1]: prev = current,
          }: any,
        ) =>
          // ) => ((prev + 3 * current + next) / 5) * Math.sin((i / length) * Math.PI),
          // current * Math.sin((i / length) * Math.PI),
          0.1 * current + 0.9 * (current * Math.sin((i / length) * Math.PI)),
      )

    const max = _.max(data)
    // data = data.map(v => v * (50 / max))
    data = data.map(v => 0.75 * v + 0.25 * v * (50 / max))

    // data = _.chunk(data, 2).map(([a, b], i, c) => (a + b) / 2) as any
    data = _.chunk(data, Math.round(data.length / bar.count)).map(([a, b], i, c) => 0.25 * a + 0.75 * b) as any

    if (canvas && canvas.getContext) {
      const canvasCtx = canvas.getContext('2d')

      canvasCtx.clearRect(0, 0, grid.width, grid.height)

      let x = 0

      for (let i = 0; i < data.length; i++) {
        const magnitude = _.max([2 * data[i], 4 * bar.width])
        const height = _.min([magnitude, bar.height * 1.5])

        canvasCtx.fillStyle =
          'rgb(' + Math.floor((0.75 + Math.sin(Math.PI * (magnitude / 50))) * magnitude + 25) + ',148,245)' //95
        // canvasCtx.fillRect(x, grid.magnitude - magnitude / 2, bar.width, magnitude / 2)

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

        x += bar.width + grid.gap
      }
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
  if (typeof stroke == 'undefined') {
    stroke = true
  }
  if (typeof radius === 'undefined') {
    radius = 4
  }
  if (typeof radius === 'number') {
    radius = { tl: radius, tr: radius, br: radius, bl: radius }
  } else {
    const defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 }
    for (const side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side]
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
