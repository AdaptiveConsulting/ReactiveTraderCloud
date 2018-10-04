import _ from 'lodash'
import React, { Component } from 'react'
import { colors, keyframes, styled, Styled } from 'rt-theme'
import { Block } from '../StyleguideRoute/styled'

import FormantIcon from './assets/Formant'
import formantSVGURL from './assets/formant.svg'
import MicrophoneIcon from './assets/Microphone'

import { faMicrophone } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import createSpeechRecognition from './createSpeechRecognition'

import { FormantBars } from './FormantBars'

import * as GreenKeyRecognition from './GreenKeyRecognition'

declare const MediaRecorder: any
declare const requestIdleCallback: any

interface Props {
  audioContext: AudioContext
}

export class VoiceInput extends Component<Props, any> {
  state = {
    started: false,
    results: [],
  } as any

  socket = GreenKeyRecognition.createWebSocket({
    onmessage: (event: MessageEvent) => {
      if (event.data) {
        const data = JSON.parse(event.data)
        const transcripts = _.map(data.segments, 'clean_transcript').map(transcript => [{ transcript }])

        if (data.segments && data.segments.length) {
          this.setState({ results: transcripts })
        }
      }
    },
  })
  audioContext = this.props.audioContext
  destination = this.audioContext.createMediaStreamDestination()
  recorder = createMediaRecorder(this.destination.stream, {
    ondataavailable: (evt: any) => {
      // push each chunk (blobs) in an array
      if (evt.data instanceof Blob) {
        if (this.socket.readyState === 1) {
          this.socket.send(evt.data)
        }
      }
    },
    onstop: (evt: any) => {
      this.socket.send('EOS')
      // Make blob out of our blobs, and open it.
      // var blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' })
      // document.querySelector('audio').src = URL.createObjectURL(blob)
      console.log(evt)
    },
  })

  analyser: AnalyserNode = _.assign(this.audioContext.createAnalyser(), {
    fftSize: 32,
    smoothingTimeConstant: 0.95,
  })
  analyserData = new Float32Array(this.analyser.frequencyBinCount)
  mediaStream: MediaStream
  microphone: MediaStreamAudioSourceNode

  intervalId = setInterval(() => {
    if (this.recorder.state === 'recording') {
      requestIdleCallback(() => this.recorder.requestData())
    }
  }, 500)

  // recognizer = createSpeechRecognition({
  //   interimResults: true,
  //   onresult: (event: any) => {
  //     // console.log(event)
  //     const { results } = event
  //     // console.log(results)
  //     this.setState({ results })
  //   },
  //   onstart: () => this.setState({ started: true }),
  //   // onend: () => this.setState({ started: false }),
  //   // onspeechstart: () => this.setState({ started: true }),
  //   // onspeechend: () => this.setState({ started: false }),
  // })

  componentDidMount() {
    if (process.env.NODE_ENV === 'development') {
      // this.toggle()
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
    _.attempt(() => this.recorder.stop())
  }

  async ensureMediaStream() {
    if (!this.mediaStream) {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      this.microphone = this.audioContext.createMediaStreamSource(this.mediaStream)

      this.microphone.connect(this.analyser)
      this.analyser.connect(this.destination)

      this.recorder.start()
    }

    return this.mediaStream
  }

  toggle = async () => {
    await this.ensureMediaStream()

    try {
      if (this.state.started) {
        this.setState({ started: false })

        // this.recognizer.stop()
      } else {
        this.setState({ started: true })
        // this.recognizer.start()
        // this.setState({ results: [] })
      }
    } catch (e) {}
  }

  render() {
    const { started, results } = this.state

    return (
      <Root bg="primary.4" onClick={this.toggle}>
        {started ? (
          <React.Fragment>
            <Fill />
            <FormantBars analyser={this.analyser} count={5} gap={1.5} width={3.5} height={40} />
            <Fill />
          </React.Fragment>
        ) : (
          <MicrophoneButton active={started} fg={started ? 'accents.primary.base' : 'secondary.base'}>
            <MicrophoneIcon />
            {/* <FontAwesomeIcon icon={faMicrophone} /> */}
          </MicrophoneButton>
        )}

        {started ? (
          <Input onClick={() => this.setState({ results: [] })}>
            {results.length === 0 ? (
              <StatusText>Listening</StatusText>
            ) : (
              _.map(results, ([{ transcript }]: any, index: number) => (
                <React.Fragment key={index}>{transcript}</React.Fragment>
              ))
            )}
          </Input>
        ) : (
          <StatusText>Press to talk</StatusText>
        )}
      </Root>
    )
  }
}

function createMediaRecorder(mediaStream: MediaStream, options: any): typeof MediaRecorder {
  return Object.assign(new MediaRecorder(mediaStream), options)
}

const Root = styled(Block)`
  display: flex;
  align-items: center;
  height: 2.75rem;
  border-radius: 1.5rem;
  width: 100%;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1) inset;
  user-select: none;

  min-width: 36rem;
  max-width: 36rem;
`

const Fill = styled(Block)`
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

const MicrophoneButton: Styled<{ active: boolean }> = styled(Block)`
  height: ${2.75}rem;
  width: ${2.75}rem;

  font-size: 1.125rem;
  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 100%;
`

const Input = styled(Block)`
  flex: 1 1 auto;
  min-width: 20rem;
  display: flex;
  min-height: 1em;
`

const AnimatedText = styled.span`
  color: ${p => p.theme.transparent};
  transition: color 1s ease, background-position 1s ease;

  background-clip: text;
  -webkit-background-clip: text;
  background-image: repeating-linear-gradient(
    45deg,
    ${p => p.theme.transparent},
    ${p => p.theme.accents.primary.base},
    ${p => p.theme.transparent}
  );
  background-size: 200%;
  background-position: 50%;

  animation: ${keyframes`
    from {
      background-position: 50%;
      color: ${colors.spectrum.transparent.base};
    }
    40% {
      background-position: 0%;
      color: currentColor;
    }
    60% {
      background-position: 100%;
      color: currentColor;
    }
    to {
      background-position: 50%;
      color: ${colors.spectrum.transparent.base};
    }
  `} infinite 3s linear;
`

const StatusText: React.SFC = props => (
  <Input onClick={this.toggle} fg="primary.2" fontSize="0.625" letterSpacing="1px" textTransform="uppercase">
    <AnimatedText>{props.children}</AnimatedText>
  </Input>
)

export const InputResult = styled(Block)``
