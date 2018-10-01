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
    smoothingTimeConstant: 0.95,
  })
  gainNode = this.audioContext.createGain()
  analyserData = new Float32Array(this.analyser.frequencyBinCount)
  mediaStream: MediaStream
  microphone: MediaStreamAudioSourceNode
  recorder: any

  // componentDidMount() {
  //   this.ensureMediaStream()
  // }

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
        this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)

        this.recog.stop()
      } else {
        await this.ensureMediaStream()
        this.gainNode.gain.setValueAtTime(1, this.audioContext.currentTime)

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

        <FormantBars analyser={this.analyser} count={7} gap={1.5} width={3.5} height={40} />

        {started || results.length ? (
          <React.Fragment>
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
