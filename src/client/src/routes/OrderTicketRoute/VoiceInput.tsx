import _ from 'lodash'
import React, { Component } from 'react'

import { colors, keyframes, styled, Styled } from 'rt-theme'
import { Block } from '../StyleguideRoute/styled'

import formantSVGURL from './assets/formant.svg'
import MicrophoneIcon from './assets/Microphone'

import { FormantBars } from './FormantBars'

import AudioContext from './AudioContext'
import { MediaPlayer } from './MediaPlayer'
import { MediaSourceSelector } from './MediaSourceSelector'
import { SessionEvent, SessionResult, SessionResultData, SimpleSession } from './NextSession'
import { UserMedia, UserMediaState } from './UserMedia'

let USE_CHANNEL = false
if (process.env.NODE_ENV === 'production') {
  USE_CHANNEL = true
} else {
  USE_CHANNEL = true
}

interface Props {
  source?: 'microphone' | 'sample'
  audioContext?: AudioContext
  requestSession: boolean
  onStart?: () => any
  onResult?: (data: VoiceInputResult) => any
  onEnd?: () => any
}

export interface VoiceInputResult extends SessionResultData {}

export class VoiceInput extends Component<Props, any> {
  static defaultProps = {
    source: 'microphone',
    audioContext: new AudioContext(),
  }

  state = {
    requestSession: false,
    sessionRequestActive: false,
    sessionRequestCount: 0,
    sessionConnected: null,
    userPermissionGranted: null,
    sessionInstance: null,
    data: null,
    transcripts: [],
  } as any & Partial<SessionResult>

  static getDerivedStateFromProps({ audioContext, requestSession, source }: Props, state: any): any | null {
    let next: any = {}
    let { destination, userMediaStream, userMediaStreamSource }: any = state

    if (requestSession !== state.requestSession) {
      next = {
        ...next,
        requestSession,
        sessionRequestActive: requestSession,
        sessionRequestCount: requestSession ? state.sessionRequestCount + 1 : state.sessionRequestCount,
        // Clear transcripts on new session
        transcripts: requestSession ? [] : state.transcripts,
      }
    }

    if (USE_CHANNEL) {
      if (destination == null) {
        const analyser = _.assign(audioContext.createAnalyser(), {
          fftSize: 32,
          smoothingTimeConstant: 0.95,
        })
        destination = audioContext.createMediaStreamDestination()

        next = {
          ...next,
          analyser,
          destination,
          forward: [analyser, destination],
        }
      }
    } else {
      if (destination == null) {
        const channelMerger = audioContext.createChannelMerger()

        const analyser = _.assign(audioContext.createAnalyser(), {
          fftSize: 32,
          smoothingTimeConstant: 0.95,
        })
        channelMerger.connect(analyser)

        const mediaStreamDestination = audioContext.createMediaStreamDestination()
        channelMerger.connect(mediaStreamDestination)

        channelMerger.connect(audioContext.destination)

        next = {
          ...next,
          analyser,
          mediaStreamDestination,
          destination: Object.assign(channelMerger, {
            stream: mediaStreamDestination.stream,
          }),
        }
        destination = next.destination
      }

      // Connect the mic 🎤
      if (userMediaStream && userMediaStreamSource == null) {
        userMediaStreamSource = audioContext.createMediaStreamSource(userMediaStream)

        userMediaStreamSource.connect(destination)

        next = {
          ...next,
          userMediaStreamSource,
        }
      }

      if (source !== state.source && destination && userMediaStreamSource) {
        switch (source) {
          case 'microphone': {
            destination.disconnect(audioContext.destination)
            userMediaStreamSource.connect(destination)
            break
          }
          case 'sample': {
            userMediaStreamSource.disconnect(destination)
            destination.connect(audioContext.destination)
          }
        }

        next = {
          ...next,
          source,
        }
      }
    }

    return next
  }

  get audioContext() {
    return this.props.audioContext
  }

  get streamDestination() {
    return this.state.destination
  }

  get analyser() {
    return this.state.analyser
  }

  get combinedDestination() {
    return this.state.destination
  }

  toggle = () => {
    this.setState(({ sessionRequestActive, sessionRequestCount, transcripts }: any) => ({
      sessionRequestActive: !sessionRequestActive,
      sessionRequestCount: !sessionRequestActive ? sessionRequestCount + 1 : sessionRequestCount,
      transcripts: sessionRequestActive ? transcripts : [],
    }))
  }

  onPermission = ({ ok, error, mediaStream }: UserMediaState) => {
    this.setState({
      userPermissionGranted: ok,
      userMediaStream: mediaStream,
    })

    if (error) {
      console.error(error)
    }
  }

  onSessionStart = (sessionInstance: any) => {
    this.setState({ sessionInstance: !!sessionInstance })
    if (this.props.onStart) {
      this.props.onStart()
    }
  }

  onSessionError = (event: SessionEvent) => {
    this.setState({ sessionConnected: false })
    if (this.props.onEnd) {
      this.props.onEnd()
    }
  }

  onSessionResult = (result: SessionResult) => {
    this.setState(result)
    if (this.props.onResult) {
      this.props.onResult(result.data as any)
    }
  }

  onSessionEnd = (sessionInstance: any) => {
    this.reset()
    if (this.props.onEnd) {
      this.props.onEnd()
    }
  }

  reset() {
    this.setState({
      sessionRequestActive: false,
      sessionConnected: null,
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
          <React.Fragment>
            {USE_CHANNEL ? (
              <MediaSourceSelector
                source={this.props.source}
                audioContext={this.props.audioContext}
                forward={this.state.forward}
                ready={sessionInstance}
                onPermission={this.onPermission}
              />
            ) : (
              <React.Fragment>
                <UserMedia.Provider audio onPermission={this.onPermission} />

                <MediaPlayer
                  loop
                  at={63}
                  rate={1.15}
                  play={this.props.source === 'sample' && sessionInstance}
                  src="/test.ogg"
                  context={this.audioContext}
                  destination={this.combinedDestination}
                />
              </React.Fragment>
            )}

            {sessionRequestActive && (
              <SimpleSession
                key={`SimpleSession${sessionRequestCount}`}
                mediaStream={this.state.destination.stream}
                onStart={this.onSessionStart}
                onError={this.onSessionError}
                onResult={this.onSessionResult}
                onEnd={this.onSessionEnd}
              />
            )}
          </React.Fragment>
        )}

        <Root bg="primary.4" onClick={this.toggle}>
          {sessionInstance ? null : (
            <MicrophoneButton // active={sessionInstance}
              fg={
                sessionRequestActive === false
                  ? 'primary.1'
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
              <StatusText>Press to talk &nbsp; ⌥O</StatusText>
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
            <Input>
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

const Root = styled(Block)`
  display: flex;
  align-items: center;
  height: 2.75rem;
  border-radius: 1.5rem;
  width: 100%;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1) inset;
  user-select: none;
  cursor: pointer;

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
