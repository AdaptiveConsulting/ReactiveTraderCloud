import _ from 'lodash'
import React, { Component } from 'react'

import { colors, keyframes, styled, Styled } from 'rt-theme'
import { Block } from '../StyleguideRoute/styled'

import formantSVGURL from './assets/formant.svg'
import MicrophoneIcon from './assets/Microphone'

import { FormantBars } from './FormantBars'

import AudioContext from './AudioContext'
import { AudioTranscriptionSession, SessionEvent, SessionResult, SessionResultData } from './AudioTranscriptionSession'
import { ChannelMerger } from './ChannelMerger'
import { MediaPlayer } from './MediaPlayer'
import { Microphone } from './Microphone'
import { UserMedia, UserMediaState } from './UserMedia'

type SourceType = 'microphone' | 'sample'
interface Props {
  source?: SourceType
  context?: AudioContext
  requestSession: boolean
  onStart?: () => any
  onResult?: (data: VoiceInputResult) => any
  onEnd?: () => any
}

interface State {
  // audio
  analyser: AnalyserNode
  destination: MediaStreamAudioDestinationNode
  outputs: AudioDestinationNode[]
  source?: SourceType
  userPermissionGranted: boolean
  // data
  requestSession: boolean
  sessionRequestActive: boolean
  sessionRequestCount: number
  sessionConnected: boolean
  sessionInstance?: any
  data?: any
  transcripts: any
}

export interface VoiceInputResult extends SessionResultData {}

export class VoiceInput extends Component<Props, State> {
  static defaultProps = {
    source: 'microphone',
    context: new AudioContext(),
  }

  state: State = {
    // audio
    analyser: Object.assign(this.props.context.createAnalyser(), {
      fftSize: 32,
      smoothingTimeConstant: 0.95,
    }),
    destination: this.props.context.createMediaStreamDestination(),
    outputs: [],
    // data
    requestSession: false,
    sessionRequestActive: false,
    sessionRequestCount: 0,
    sessionConnected: null,
    sessionInstance: null,
    userPermissionGranted: null,
    data: null,
    transcripts: [],
  }

  static getDerivedStateFromProps({ context, source, requestSession }: Props, state: State): Partial<State> {
    let next: any = {}
    const { analyser, destination }: any = state

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

    if (source !== state.source) {
      next = {
        ...next,
        source,
        outputs: [analyser, destination]
          // Send audio to speakers during playback
          .concat(source === 'sample' ? context.destination : []),
      }
    }

    return next
  }

  toggle = () => {
    this.setState(({ sessionRequestActive, sessionRequestCount, transcripts }: any) => ({
      sessionRequestActive: !sessionRequestActive,
      sessionRequestCount: !sessionRequestActive ? sessionRequestCount + 1 : sessionRequestCount,
      transcripts: sessionRequestActive ? transcripts : [],
    }))
  }

  onPermission = ({ ok }: UserMediaState) => {
    this.setState({ userPermissionGranted: ok })
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
    const { context, source } = this.props
    const {
      sessionRequestCount,
      sessionRequestActive,
      sessionConnected,
      userPermissionGranted,
      sessionInstance,
      transcripts,
      outputs,
      analyser,
      destination,
    } = this.state

    return (
      <React.Fragment>
        {sessionRequestCount > 0 && (
          <React.Fragment>
            {sessionRequestActive && (
              // Open session to recognition backend and stream from output
              <AudioTranscriptionSession
                key={`Session${sessionRequestCount}`}
                input={destination.stream}
                onStart={this.onSessionStart}
                onError={this.onSessionError}
                onResult={this.onSessionResult}
                onEnd={this.onSessionEnd}
              />
            )}

            <ChannelMerger context={context} outputs={outputs}>
              {({ destination }) => (
                <React.Fragment>
                  <MediaPlayer
                    context={context}
                    output={destination}
                    src="/test.ogg"
                    play={source === 'sample' && sessionInstance}
                    loop
                    at={63}
                    rate={1.15}
                  />
                  <UserMedia.Provider audio onPermission={this.onPermission}>
                    <UserMedia.Consumer>
                      {userMedia => (
                        // Request user permission and output to destination
                        <Microphone
                          context={context}
                          output={source === 'microphone' ? destination : null}
                          mediaStream={userMedia.mediaStream}
                        />
                      )}
                    </UserMedia.Consumer>
                  </UserMedia.Provider>
                </React.Fragment>
              )}
            </ChannelMerger>
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
              <FormantBars analyser={analyser} count={5} gap={1.5} width={3.5} height={40} />
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
                          <StatusText accent="aware">We're having trouble inputsing</StatusText>
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
