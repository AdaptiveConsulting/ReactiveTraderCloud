import _ from 'lodash'
import React from 'react'
import { styled } from 'rt-theme'

import { Block, BlockProps } from '../styled'

export interface SectionProps extends BlockProps {
  mh?: any
  invert?: boolean
  intent?: 'primary' | 'secondary' | 'inverted'
}

const intents = {
  primary: ['primary.base', 'secondary.base'],
  secondary: ['primary.1', 'secondary.1'],
  inverted: ['secondary.3', 'primary.1']
}

export class SectionBlock extends React.Component<SectionProps, { error?: boolean }> {
  state = {
    error: false
  }

  componentDidCatch() {
    this.setState({ error: true })
  }

  render() {
    if (this.state.error) {
      return (
        <pre>
          <code>{this.state.error}</code>
        </pre>
      )
    }

    const { children, intent = 'primary', invert, ...props } = this.props

    let [backgroundColor, textColor] = intents[intent]

    if (invert) {
      ;[textColor, backgroundColor] = [backgroundColor, textColor]
    }

    return (
      <Section backgroundColor={backgroundColor} textColor={textColor} {...props}>
        <div>
          <SectionBody>{children}</SectionBody>
        </div>
      </Section>
    )
  }
}

export const Section = styled(Block)<SectionProps>`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;

  min-height: ${({ mh = 4 }) => mh * 5}rem;
  margin: 0;

  font-size: 0.875rem;

  padding-left: 1rem;
  padding-right: 1rem;

  @media all and (min-width: 375px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  @media all and (min-width: 420px) {
    padding-left: 2rem;
    padding-right: 2rem;
  }
`

export const SectionBody = styled.div`
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  max-width: 60rem;
`

export const SectionRoot = styled.div`
  ${Section} + ${Section} ${SectionBody} {
    margin-top: 2rem;
    margin-bottom: 2rem;
  }
`
