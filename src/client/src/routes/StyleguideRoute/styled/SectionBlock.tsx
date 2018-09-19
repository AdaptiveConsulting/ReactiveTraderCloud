import _ from 'lodash'
import React from 'react'
import { css, styled, Styled } from 'rt-theme'

import { rules } from 'rt-styleguide'
import { Block, BlockProps } from '../styled'
import { mapMarginPaddingProps, MarginPaddingProps } from './mapMarginPaddingProps'

export interface SectionProps extends BlockProps, MarginPaddingProps {
  mh?: number
  invert?: boolean
  intent?: 'primary' | 'secondary' | 'inverted'
  bleeds?: boolean
}

const intents = {
  primary: ['primary.base', 'secondary.base'],
  secondary: ['primary.1', 'secondary.1'],
  inverted: ['secondary.3', 'primary.1'],
}

export class SectionBlock extends React.Component<SectionProps, { error?: boolean }> {
  state = {
    error: false,
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
      <SectionBleed py={2} backgroundColor={backgroundColor} textColor={textColor} {...props}>
        <div
        // Allows SectionBody margins to collapse with children
        >
          <SectionBody>{children}</SectionBody>
        </div>
      </SectionBleed>
    )
  }
}

export const SectionBleed: Styled<SectionProps> = styled(Block)`
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

  @media all and (min-width: 0) {
    ${mapMarginPaddingProps};
  }

  ${({ bleeds }: SectionProps): false | ReturnType<typeof css> =>
    bleeds &&
    css`
      @media all and (max-width: 960px) {
        padding-right: 0;
        padding-left: 0;
        overflow-x: scroll;

        ${rules.touchScroll};

        ${SectionBody} {
          width: max-content;
          min-width: 100%;
          max-width: 60rem;

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
        }
      }
    `};
`

export const SectionBody = styled.div`
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  max-width: 60rem;
  ${SectionBleed} + ${SectionBleed} & {
    margin-top: 2rem;
    margin-bottom: 2rem;
  }
`
