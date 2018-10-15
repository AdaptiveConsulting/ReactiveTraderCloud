import _ from 'lodash'
import React, { Component } from 'react'
import { colors, keyframes, styled, Styled } from 'rt-theme'
import { Block } from '../StyleguideRoute/styled'

import formantSVGURL from './assets/formant.svg'
import MicrophoneIcon from './assets/Microphone'

import { FormantBars } from './FormantBars'

import * as GreenKeyRecognition from './GreenKeyRecognition'
import { SessionEvent, SessionResult, SimpleSession } from './SimpleSession'
import { UserMedia } from './UserMedia'

declare const MediaRecorder: any
declare const requestIdleCallback: any

interface Props {
  audioContext: AudioContext
  onResult?: (data: GreenKeyRecognition.InterpretedQuote) => void
}

export interface VoiceInputResult extends SessionResult {}

export class VoiceInput extends Component<Props, any> {
  state = {
    sessionRequestCount: 0,
    sessionRequestActive: false,
    sessionConnected: null,
    userPermissionGranted: null,
    sessionInstance: null,
    data: null,
    transcripts: [],
  } as any & Partial<SessionResult>

  get audioContext() {
    return this.props.audioContext
  }

  destination = this.audioContext.createMediaStreamDestination()
  analyser: AnalyserNode = _.assign(this.audioContext.createAnalyser(), {
    fftSize: 32,
    smoothingTimeConstant: 0.95,
  })

  toggle = () => {
    this.setState(({ sessionRequestCount, sessionRequestActive }: any) => ({
      sessionRequestCount: !sessionRequestActive ? sessionRequestCount + 1 : sessionRequestCount,
      sessionRequestActive: !sessionRequestActive,
    }))
  }

  onPermission = ({ ok }: SessionEvent) => {
    this.setState({ userPermissionGranted: ok })
  }

  onSessionStart = (sessionInstance: any) => {
    this.setState({ sessionInstance: !!sessionInstance })
  }

  onSessionError = (event: SessionEvent) => {
    if (event.source === 'media') {
      this.setState({ userPermissionGranted: false })
    }

    if (event.source === 'socket') {
      this.setState({ sessionConnected: false })
    }
  }

  onSessionResult = (result: SessionResult) => {
    this.setState(result)
    if (this.props.onResult) {
    }
  }

  onSessionEnd = (sessionInstance: any) => {
    this.reset()
  }

  reset() {
    this.setState({
      sessionRequestActive: false,
      sessionConnected: null,
      userPermissionGranted: null,
      sessionInstance: null,
    })
  }

  render() {
    const {
      sessionRequestCount,
      sessionRequestActive,
      sessionConnected,
      userPermissionGranted,
      sessionInstance,
      transcripts,
    } = this.state

    return (
      <React.Fragment>
        {sessionRequestCount > 0 && (
          <UserMedia.Provider>
            {sessionRequestActive && (
              <UserMedia.Consumer>
                {userMedia => (
                  <SimpleSession
                    audioContext={this.audioContext}
                    userMedia={userMedia}
                    analyser={this.analyser}
                    destination={this.destination}
                    onStart={this.onSessionStart}
                    onError={this.onSessionError}
                    onPermission={this.onPermission}
                    onResult={this.onSessionResult}
                    onEnd={this.onSessionEnd}
                  />
                )}
              </UserMedia.Consumer>
            )}
          </UserMedia.Provider>
        )}

        <Root bg="primary.4" onClick={this.toggle}>
          {sessionInstance ? null : (
            <MicrophoneButton // active={sessionInstance}
              fg={
                sessionRequestActive === false
                  ? 'secondary.4'
                  : userPermissionGranted === false
                    ? 'accents.aware.base'
                    : 'accents.primary.base'
              }
            >
              <MicrophoneIcon />
            </MicrophoneButton>
          )}

          {!sessionInstance ? null : (
            <React.Fragment>
              <Fill />
              <FormantBars analyser={this.analyser} count={5} gap={1.5} width={3.5} height={40} />
              <Fill />
            </React.Fragment>
          )}

          {transcripts.length === 0 ? (
            !sessionRequestActive ? (
              <StatusText>Press to talk</StatusText>
            ) : (
              <React.Fragment>
                {userPermissionGranted == null ? (
                  <StatusText>Waiting for permission</StatusText>
                ) : (
                  <React.Fragment>
                    {userPermissionGranted === false && (
                      <StatusText accent="aware">Check microphone permissions</StatusText>
                    )}
                    {userPermissionGranted === true && (
                      <React.Fragment>
                        {sessionConnected === false ? (
                          <StatusText accent="aware">We're having trouble connecting</StatusText>
                        ) : transcripts.length <= 0 ? (
                          <StatusText>Listening</StatusText>
                        ) : null}
                      </React.Fragment>
                    )}
                  </React.Fragment>
                )}
              </React.Fragment>
            )
          ) : (
            <Input onClick={() => this.setState({ transcripts: [] })}>
              {_.map(transcripts, ([{ transcript }]: any, index: number) => (
                <React.Fragment key={index}>
                  {transcript}
                  <span>&nbsp;</span>
                </React.Fragment>
              ))}
            </Input>
          )}
        </Root>
      </React.Fragment>
    )
  }
}

const Transcript = ({ results }: any) =>
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
  overflow: hidden;
`

const Fill = styled(Block)`
  min-height: 1rem;
  max-height: 100%;
  min-width: 1rem;
`

export const Formant: Styled<{ sessionInstance: boolean }> = styled.div`
  height: 2rem;
  width: 2rem;
  [fill] {
    fill: ${({ sessionInstance, theme }) => (sessionInstance ? theme.accents.primary.base : theme.secondary.base)};
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
  width: ${3.5}rem;

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

const AnimatedText: Styled<{ accent?: string }> = styled.span`
  color: ${p => p.theme.transparent};
  transition: color 1s ease, background-position 1s ease;

  background-clip: text;
  -webkit-background-clip: text;
  background-image: repeating-linear-gradient(
    45deg,
    ${p => p.theme.transparent},
    ${p => (p.theme.accents[p.accent] || p.theme.accents.primary).base},
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

const StatusText: React.SFC<{ accent?: string }> = ({ accent, children }) => (
  <Input
    onClick={this.toggle}
    fg={accent ? `accents.${accent}.base` : 'primary.2'}
    fontSize="0.625"
    letterSpacing="1px"
    textTransform="uppercase"
  >
    <AnimatedText accent={accent}>{children}</AnimatedText>
  </Input>
)

export const InputResult = styled(Block)`
  display: inline;
`
