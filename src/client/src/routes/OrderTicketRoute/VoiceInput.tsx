import React from 'react'
import { mix } from 'polished'

import { faChevronCircleRight, faPlay } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Block } from '../StyleguideRoute/styled'
import { AudioContext } from './AudioContext'
import { BlobDownload } from './devtools/BlobDownload'
import { ChannelMerger } from './ChannelMerger'
import { MediaPlayer } from './MediaPlayer'
import { Microphone } from './Microphone'
import { ScribeSession, SessionEvent } from './ScribeSession'
import { UserMedia, UserMediaState } from './UserMedia'
import { TranscriptionSession, SessionResult } from './TranscriptionSession'
import { Timer } from 'rt-components'

import FormantBars from './FormantBars'
import MicrophoneIcon from './assets/Microphone'
import { colors, styled, AccentName } from 'rt-theme'
import { keyframes } from 'styled-components'

type SourceType = 'microphone' | 'sample'
interface Props {
  value: string[]
  source?: SourceType
  context?: AudioContext
  requestSession?: boolean
  onStart?: () => void
  onResult?: (data: VoiceInputResult) => void
  onEnd?: () => void
  // testing
  features: {
    [key: string]: any
  }
}

interface State {
  // audio
  analyser: AnalyserNode
  blob?: Blob
  destination: MediaStreamAudioDestinationNode
  outputs: AudioDestinationNode[]
  source?: SourceType
  userPermissionGranted: boolean
  // connection
  requestSession: boolean
  sessionActive: boolean
  sessionCount: number
  sessionConnected: boolean
  sessionInstance?: any
  sessionError?: SessionEvent
  // data
  value?: any
}

// tslint:disable-next-line
export interface VoiceInputResult extends SessionResult {}

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
  }

  static getDerivedStateFromProps({ context, source, requestSession }: Props, state: State): Partial<State> {
    let next: any = null
    const { analyser, blob, destination }: any = state

    requestSession = Boolean(requestSession)

    // Reset session on session request change
    if (requestSession !== state.requestSession) {
      next = {
        ...next,
        requestSession,
        sessionActive: requestSession,
        sessionCount: requestSession ? state.sessionCount + 1 : state.sessionCount,
        sessionError: null,
        // Clear value on new session
        blob: source === 'sample' ? blob : null,
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
        blob: this.session.chunks.length > 20 ? new Blob(this.session.chunks) : null,
      }
    }

    return next
  }

  // @ts-ignore
  componentDidUpdate(prevProps: Props, prevState: State, snapshot: State) {
    if (snapshot != null) {
      this.setState(snapshot)
    }

    if (prevProps.requestSession && prevState.sessionActive && this.props.requestSession && !this.state.sessionActive) {
      this.onSessionEnd()
    }
  }

  toggle = () => {
    this.setState(({ sessionActive, sessionCount, value }) => {
      sessionActive = !sessionActive

      return {
        sessionActive,
        sessionCount: sessionActive ? sessionCount + 1 : sessionCount,
        sessionError: null,
      }
    })
  }

  onPermission = ({ ok }: UserMediaState) => {
    this.setState({ userPermissionGranted: ok })
  }

  onSessionStart = () => {
    if (this.props.onStart) {
      this.props.onStart()
    }
  }

  onSessionResult = (result: SessionResult) => {
    if (this.props.onResult) {
      this.props.onResult(result)
    }
  }

  onSessionError = (event: SessionEvent) => {
    this.setState({
      sessionError: event,
      sessionConnected: false,
    })
  }

  onSessionEnd: () => void = async () => {
    if ((await new Promise<State>(resolve => this.setState(resolve))).sessionError) {
      return null
    }

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

  renderInput(): React.ReactNode {
    const { value } = this.props
    const { userPermissionGranted, sessionActive, sessionConnected } = this.state

    if (value) {
      return (
        <Input>
          {value}
          <span>&nbsp;</span>
        </Input>
      )
    }
    if (!sessionActive) {
      return <StatusText toggle={this.toggle}>Press to talk &nbsp; ⌥O</StatusText>
    }
    if (userPermissionGranted == null) {
      return <StatusText toggle={this.toggle}>Waiting for permission</StatusText>
    }
    if (userPermissionGranted === false) {
      return (
        <StatusText accent="aware" toggle={this.toggle}>
          Check microphone permissions
        </StatusText>
      )
    }
    if (sessionConnected === false) {
      return (
        <StatusText accent="aware" toggle={this.toggle}>
          We're having trouble connecting
        </StatusText>
      )
    }
    return <StatusText toggle={this.toggle}>Listening</StatusText>
  }

  render() {
    const {
      context,
      source,
      // testing
      features,
    } = this.props
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
      sessionError,
    } = this.state

    return (
      <>
        {/* Pure data components for session connection and audio graph */}
        {sessionCount > 0 && (
          <ChannelMerger context={context} outputs={outputs}>
            {({ destination }) => (
              <>
                {source === 'sample' && (
                  // Mount sample audio for testing
                  <MediaPlayer
                    key={sessionCount}
                    context={context}
                    output={destination}
                    play={sessionInstance}
                    {...(blob
                      ? { src: blob }
                      : {
                          src: `/audio/${['netflix', 'apple', 'snap'][sessionCount % 3]}.ogg`,
                          at: 0,
                          loop: true,
                          rate: 1.25,
                        })}
                  />
                )}

                {/* Request user permission and output to destination */}
                <UserMedia.Provider audio onPermission={this.onPermission}>
                  <UserMedia.Consumer>
                    {userMedia => (
                      <>
                        <Microphone
                          context={context}
                          output={source === 'microphone' ? destination : null}
                          mediaStream={userMedia.mediaStream}
                        />

                        {userMedia.mediaStream &&
                          sessionActive &&
                          // Open session to recognition backend and stream from output

                          (features.useNext ? (
                            <TranscriptionSession
                              ref={this.setSession}
                              key={`TranscriptionSession${sessionCount}`}
                              input={input.stream}
                              onStart={this.onSessionStart}
                              onResult={this.onSessionResult}
                              onError={this.onSessionError}
                              onEnd={this.onSessionEnd}
                            />
                          ) : (
                            <ScribeSession
                              ref={this.setSession}
                              key={`ScribeSession${sessionCount}`}
                              input={input.stream}
                              onStart={this.onSessionStart}
                              onResult={this.onSessionResult}
                              onError={this.onSessionError}
                              onEnd={this.onSessionEnd}
                            />
                          ))}
                      </>
                    )}
                  </UserMedia.Consumer>
                </UserMedia.Provider>
              </>
            )}
          </ChannelMerger>
        )}

        {/* Reset after error and user message */}
        {sessionError && <Timer duration={5000} timeout={this.toggle} />}

        {/* Rendered output */}
        <Root bg={t => t.primary[4]} onClick={this.toggle}>
          {sessionInstance ? (
            <>
              <Fill />
              <FormantBars
                analyser={analyser}
                count={5}
                gap={1.5}
                width={3.5}
                height={40}
                color={
                  !sessionError
                    ? null
                    : magnitude => {
                        return mix(
                          1 - Math.sin(magnitude * magnitude),
                          colors.accents.aware.base,
                          colors.accents.bad.base,
                        )
                      }
                }
              />
              <Fill />
            </>
          ) : (
            <MicrophoneButton
              fg={
                sessionActive === false
                  ? t => t.primary[1]
                  : sessionError || userPermissionGranted === false
                  ? t => t.accents.aware.base
                  : t => t.accents.dominant.base
              }
            >
              {source === 'microphone' ? <MicrophoneIcon /> : <FontAwesomeIcon icon={faPlay} />}
            </MicrophoneButton>
          )}

          {this.renderInput()}

          {features.useNext && (
            <MicrophoneButton
              fg={
                sessionActive === false
                  ? t => t.primary[1]
                  : userPermissionGranted === false
                  ? t => t.accents.aware.base
                  : t => t.accents.dominant.base
              }
            >
              <FontAwesomeIcon icon={faChevronCircleRight} />
            </MicrophoneButton>
          )}

          {blob && source === 'microphone' && process.env.NODE_ENV === 'development' && (
            <BlobDownload blob={blob} download="order-ticket-audio.webm" force />
          )}
        </Root>
      </>
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

  outline: none;
`

const Fill = styled(Block)`
  min-height: 1rem;
  max-height: 100%;
  min-width: 1rem;
`

export const Formant = styled.div<{ sessionInstance: boolean }>`
  height: 2rem;
  width: 2rem;
  [fill] {
    fill: ${({ sessionInstance, theme }) => (sessionInstance ? theme.accents.dominant.base : theme.secondary.base)};
  }
`

const MicrophoneButton = styled(Block)<{ active?: boolean }>`
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

const AnimatedText = styled.span<{ accent?: AccentName }>`
  color: ${p => colors.static.transparent};
  transition: color 1s ease, background-position 1s ease;

  background-clip: text;
  -webkit-background-clip: text;
  background-image: repeating-linear-gradient(
    45deg,
    ${p => colors.static.transparent},
    ${({ theme, accent = 'dominant' }) => theme.accents[accent].base},
    ${p => colors.static.transparent}
  );
  background-size: 200%;
  background-position: 50%;

  animation: ${keyframes`
    from {
      background-position: 50%;
      color: ${colors.static.transparent};
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
      color: ${colors.static.transparent};
    }
  `} infinite 3s linear;
`

const StatusText: React.FC<{ accent?: AccentName; toggle: () => void }> = ({ accent, children, toggle }) => (
  <Input
    onClick={toggle}
    fg={t => accent ? t.accents[accent].base : t.primary[2]}
    fontSize={0.625}
    letterSpacing={1}
    textTransform="uppercase"
  >
    <AnimatedText accent={accent}>{children}</AnimatedText>
  </Input>
)

export const InputResult = styled(Block)`
  display: inline;
`
