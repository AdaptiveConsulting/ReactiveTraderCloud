import _ from 'lodash'
import React, { Component } from 'react'

import { colors, keyframes, styled, Styled } from 'rt-theme'
import { Block } from '../StyleguideRoute/styled'

import formantSVGURL from './assets/formant.svg'
import MicrophoneIcon from './assets/Microphone'

import { FormantBars } from './FormantBars'

import AudioContext from './AudioContext'
import { ChannelMerger } from './ChannelMerger'
import { MediaPlayer } from './MediaPlayer'
import { Microphone } from './Microphone'
import { TranscriptionSession, SessionResult, SessionResultData } from './TranscriptionSession'
import { UserMedia, UserMediaState } from './UserMedia'

import BlobDownload from './devtools/BlobDownload'

type SourceType = 'microphone' | 'sample'
interface Props {
  source?: SourceType
  context?: AudioContext
  requestSession?: boolean
  onStart?: () => any
  onResult?: (data: VoiceInputResult) => any
  onEnd?: () => any
}

interface State {
  // audio
  analyser: AnalyserNode
  blob?: Blob
  destination: MediaStreamAudioDestinationNode
  outputs: AudioDestinationNode[]
  source?: SourceType
  userPermissionGranted: boolean
  // data
  requestSession: boolean
  sessionActive: boolean
  sessionCount: number
  sessionConnected: boolean
  sessionInstance?: any
  transcripts: any
}

export interface VoiceInputResult extends SessionResultData {}

export class VoiceInput extends React.PureComponent<Props, State> {
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
    userPermissionGranted: null,
    // data
    requestSession: false,
    sessionActive: false,
    sessionCount: 0,
    sessionConnected: null,
    sessionInstance: null,
    transcripts: [],
  }

  static getDerivedStateFromProps({ context, source, requestSession }: Props, state: State): Partial<State> {
    let next: any = null
    const { analyser, destination }: any = state

    requestSession = Boolean(requestSession)

    // Reset session on session request change
    if (requestSession !== state.requestSession) {
      next = {
        ...next,
        requestSession,
        sessionActive: requestSession,
        sessionCount: requestSession ? state.sessionCount + 1 : state.sessionCount,
        // Clear transcripts on new session
        transcripts: requestSession ? [] : state.transcripts,
        blob: null,
      }
    }

    // Change output on source change
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

  getSnapshotBeforeUpdate({ source }: Props, { sessionInstance, sessionActive }: State) {
    let next = null

    // Capture last voice recording for replay in testing
    if (source === 'microphone' && sessionInstance && sessionActive && !this.state.sessionActive) {
      next = {
        blob: this.session.chunks.length > 0 ? new Blob(this.session.chunks) : null,
      }
    }

    return next
  }

  componentDidUpdate(prevProps: Props, prevState: State, snapshot: State) {
    if (snapshot != null) {
      this.setState(snapshot)
    }
  }

  toggle = () => {
    this.setState(({ sessionActive, sessionCount, transcripts }: any) => ({
      sessionActive: !sessionActive,
      sessionCount: !sessionActive ? sessionCount + 1 : sessionCount,
      transcripts: sessionActive ? transcripts : [],
    }))
  }

  onPermission = ({ ok }: UserMediaState) => {
    this.setState({ userPermissionGranted: ok })
  }

  onSessionStart = (sessionInstance: any) => {
    if (this.props.onStart) {
      this.props.onStart()
    }
  }

  onSessionResult = ({ data, transcripts }: SessionResult) => {
    this.setState({ transcripts })

    if (this.props.onResult) {
      this.props.onResult(data as any)
    }
  }

  onSessionError = () => {
    this.setState({
      sessionConnected: false,
      sessionInstance: null,
    })

    if (this.props.onEnd) {
      this.props.onEnd()
    }
  }

  onSessionEnd = (sessionInstance: any) => {
    this.setState({
      sessionActive: false,
      sessionConnected: null,
      sessionInstance: null,
    })

    if (this.props.onEnd) {
      this.props.onEnd()
    }
  }

  session?: TranscriptionSession
  setSession = (session: any) => {
    this.session = session
    this.setState({
      sessionInstance: session,
    })
  }

  render() {
    const { context, source } = this.props
    const {
      // audio
      analyser,
      blob,
      destination: input,
      outputs,
      userPermissionGranted,
      // session
      sessionInstance,
      sessionCount,
      sessionActive,
      sessionConnected,
      transcripts,
    } = this.state

    return (
      <React.Fragment>
        {// Pure data components for session connection and audio graph

        sessionCount > 0 && (
          <ChannelMerger context={context} outputs={outputs}>
            {({ destination }) => (
              <React.Fragment>
                {source === 'sample' && (
                  // Mount sample audio for testing
                  <MediaPlayer
                    key={`MediaPlayer${sessionCount}`}
                    context={context}
                    output={destination}
                    play={sessionInstance}
                    {...(blob
                      ? { src: blob }
                      : {
                          src: '/test.ogg',
                          at: 118.5,
                          loop: true,
                          // rate: 1.2,
                          rate: 1.3,
                        })}
                  />
                )}

                {
                  // Request user permission and output to destination

                  <UserMedia.Provider audio onPermission={this.onPermission}>
                    <UserMedia.Consumer>
                      {userMedia => (
                        <React.Fragment>
                          <Microphone
                            context={context}
                            output={source === 'microphone' ? destination : null}
                            mediaStream={userMedia.mediaStream}
                          />

                          {userMedia.mediaStream &&
                            sessionActive && (
                              // Open session to recognition backend and stream from output

                              <TranscriptionSession
                                ref={this.setSession}
                                key={`Session${sessionCount}`}
                                input={input.stream}
                                onStart={this.onSessionStart}
                                onResult={this.onSessionResult}
                                onError={this.onSessionError}
                                onEnd={this.onSessionEnd}
                              />
                            )}
                        </React.Fragment>
                      )}
                    </UserMedia.Consumer>
                  </UserMedia.Provider>
                }
              </React.Fragment>
            )}
          </ChannelMerger>
        )}

        {
          // Rendered Output
        }
        <Root bg="primary.4" onClick={this.toggle}>
          {sessionInstance ? null : (
            <MicrophoneButton
              fg={
                sessionActive === false
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
            !sessionActive ? (
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

          {blob &&
            source === 'microphone' &&
            process.env.NODE_ENV === 'development' && (
              <BlobDownload blob={blob} download="order-ticket-audio.webm" force />
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
