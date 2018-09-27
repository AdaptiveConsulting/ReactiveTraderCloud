import _ from 'lodash'
import React, { Component } from 'react'
import { styled, Styled } from 'rt-theme'
import { Block } from '../StyleguideRoute/styled'

import FormantIcon from './assets/Formant'
import formantSVGURL from './assets/formant.svg'

import { faMicrophone } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

declare const webkitSpeechRecognition: any

export class VoiceInput extends Component<{}, any> {
  state = {
    started: false,
    results: [],
  } as any

  recog = Object.assign(new webkitSpeechRecognition(), {
    lang: 'en-US',
    interimResults: true,
    onresult: ({ results }: any) => {
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

  toggle = () => {
    this.setState(
      (): null => null,
      () => {
        if (this.state.started) {
          this.recog.stop()
        } else {
          this.recog.start()
          this.setState({ results: [] })
        }
      },
    )
  }

  render() {
    const { started, results } = this.state

    return (
      <Root bg="primary.4">
        <MicrophoneButton fg={started ? 'accents.accent.base' : 'secondary.base'} onClick={this.toggle}>
          <FontAwesomeIcon icon={faMicrophone} />
        </MicrophoneButton>
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
`
export const InputResult = styled(Block)``
