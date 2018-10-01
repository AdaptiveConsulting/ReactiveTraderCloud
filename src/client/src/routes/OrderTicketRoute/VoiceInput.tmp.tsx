import _ from 'lodash'
import React, { Component } from 'react'
import { styled, Styled } from 'rt-theme'
import { Block } from '../StyleguideRoute/styled'

import FormantIcon from './assets/Formant'
import formantSVGURL from './assets/formant.svg'

import { faMicrophone } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import createSpeechRecognition from './createSpeechRecognition'

import { FormantBars } from './FormantBars'

declare const MediaRecorder: any

export class VoiceInput extends Component<{}, any> {
  state = {
    started: false,
    results: [],
  } as any

  audioContext = new AudioContext()
  analyser: AnalyserNode = _.assign(this.audioContext.createAnalyser(), {
    fftSize: 32,
    smoothingTimeConstant: 0.925,
  })
  analyserData = new Float32Array(this.analyser.frequencyBinCount)
  mediaStream: MediaStream
  microphone: MediaStreamAudioSourceNode
  recorder: any
  canvas: any
  canvasScale = 2
  canvasWidth = this.canvasScale * 6 * (this.analyser.frequencyBinCount / 2)
  canvasHeight = this.canvasScale * 32
  frameID: any

  componentDidMount() {
    this.ensureMediaStream()
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.frameID)
  }

  async ensureMediaStream() {
    if (!this.mediaStream) {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      this.microphone = this.audioContext.createMediaStreamSource(this.mediaStream)
      this.recorder = new MediaRecorder(this.mediaStream)

      this.microphone.connect(this.analyser)
      this.analyser.connect(this.audioContext.destination)

      console.log(this.recorder.start())
    }

    return this.mediaStream
  }

  setCanvas = async (canvas: any) => {
    await this.ensureMediaStream()

    this.canvas = canvas

    cancelAnimationFrame(this.frameID)

    this.draw()
  }

  draw = () => {
    if (typeof this === 'undefined') {
      return
    }

    const { analyser, analyserData, canvas } = this

    this.frameID = requestAnimationFrame(this.draw)

    analyser.getFloatFrequencyData(analyserData)
    // analyser.getFloatTimeDomainData(analyserData)

    let data = analyserData
    let size = analyserData.length

    if (!Number.isFinite(data[0])) {
      return
    }

    data = data
      .slice(0)
      .map(v => v + 140)
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
          current * Math.sin((i / length) * Math.PI),
      )

    const max = _.max(data)
    data = data.map(v => 0.75 * v + 0.25 * v * (50 / max))
    // data = data.map(v => v * (50 / max))
    data = _.chunk(data, 2).map(([a, b], i, c) => (a + b) / 2) as any
    // data = _.chunk(data, 2).map(([a, b], i, c) => 0.25 * a + 0.75 * b) as any

    size = data.length
    // const data = analyserData

    const WIDTH = this.canvasWidth
    const HEIGHT = this.canvasHeight

    if (canvas && canvas.getContext) {
      const canvasCtx = canvas.getContext('2d')

      // canvasCtx.fillStyle = 'rgba(0, 0, 0, 0)'
      // canvasCtx.fillRect(0, 0, WIDTH, HEIGHT)
      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT)

      const padding = 2 * this.canvasScale
      const barWidth = WIDTH / data.length - padding
      let barHeight
      let x = 0

      for (let i = 0; i < data.length; i++) {
        barHeight = _.max([data[i] * this.canvasScale, 24])

        canvasCtx.fillStyle =
          'rgb(' + Math.floor((0.75 + Math.sin(Math.PI * (barHeight / 50))) * barHeight + 25) + ',148,245)' //95
        // canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2)

        roundRect({
          ctx: canvasCtx,
          x,
          y: HEIGHT / 2 - barHeight / 4,
          width: barWidth,
          height: barHeight / 2,
          radius: 2 * this.canvasScale,
          fill: true,
          stroke: false,
        })

        x += barWidth + padding
      }
    }
  }

  recog = createSpeechRecognition({
    // interimResults: true,
    onresult: (event: any) => {
      console.log(event)
      const { results } = event
      console.log(results)
      this.setState({ results })
    },
    onstart: () => this.setState({ started: true }),
    onspeechstart: () => {
      this.setState({ started: true })
    },
    onend: () => this.setState({ started: false }),
    onspeechend: () => this.setState({ started: false }),
  })

  toggle = async () => {
    await new Promise(resolve => this.setState(null, resolve))

    try {
      if (this.state.started) {
        this.recog.stop()
      } else {
        this.recog.start()
        this.setState({ results: [] })
      }
    } catch (e) {}
  }

  render() {
    const { started, results } = this.state

    return (
      <Root bg="primary.4">
        <MicrophoneButton fg={started ? 'accents.accent.base' : 'secondary.base'} onClick={this.toggle}>
          <FontAwesomeIcon icon={faMicrophone} />
        </MicrophoneButton>

        {true && (
          <React.Fragment>
            <canvas
              ref={this.setCanvas}
              id="visual"
              {...{
                width: `${this.canvasWidth}px`,
                height: `${this.canvasHeight}px`,
                style: {
                  width: `${this.canvasWidth / this.canvasScale}px`,
                  height: `${this.canvasHeight / this.canvasScale}px`,
                },
              }}
            />
            <AutoFill />
          </React.Fragment>
        )}

        <FormantBars analyser={this.analyser} />

        {started || results.length ? (
          <React.Fragment>
            <Formant started={started}>
              <FormantIcon width="2rem" height="2rem" />
            </Formant>
            <AutoFill />
            <Input onClick={() => this.setState({ results: [] })}>
              {_.map(results, ([{ transcript }]: any, index: number) => (
                <React.Fragment key={index}>{transcript}</React.Fragment>
              ))}
            </Input>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <AutoFill />
            <Input onClick={this.toggle} fg="primary.3" fontSize="0.6" letterSpacing="1px" textTransform="uppercase">
              Press to talk
            </Input>
          </React.Fragment>
        )}
      </Root>
    )
  }
}

const Root = styled(Block)`
  display: flex;
  align-items: center;
  height: 2.75rem;
  border-radius: 1.5rem;
  width: 100%;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1) inset;
`

const AutoFill = styled(Block)`
  fill: 1 1 100%;
  min-height: 1rem;
  max-height: 100%;
  min-width: 1rem;
`

export const Formant: Styled<{ started: boolean }> = styled.div`
  height: 2rem;
  width: 2rem;
  [fill] {
    fill: ${({ started, theme }) => (started ? theme.accents.primary.base : theme.secondary.base)};
  }
`

export const StaicFormant = styled.div`
  height: 2rem;
  width: 2rem;
  background-image: url(${formantSVGURL});
  background-size: cover;
`

const MicrophoneButton = styled(Block)`
  width: 3rem;

  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Input = styled(Block)`
  flex: 1 1 auto;
  min-width: 20rem;
  display: flex;
  min-height: 1em;
`

export const InputResult = styled(Block)``

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
