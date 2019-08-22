import React from 'react'

import { rules } from 'rt-styleguide'
import { Block, BlockProps } from '../styled'
import { mapMarginPaddingProps, MarginPaddingProps } from './mapMarginPaddingProps'
import { styled, ColorProps as ThemeSelectorPair } from 'rt-theme'
import { css } from 'styled-components'

type ColorSchemeName = 'primary' | 'secondary' | 'inverted'
export interface SectionProps extends BlockProps, MarginPaddingProps {
  mh?: number
  invert?: boolean
  colorScheme?: ColorSchemeName
  bleeds?: boolean
}

const colorSchemes: { [scheme in ColorSchemeName]: ThemeSelectorPair } = {
  primary: { bg: t => t.primary.base, fg: t => t.secondary.base },
  secondary: { bg: t => t.primary[1], fg: t => t.secondary[1] },
  inverted: { bg: t => t.secondary[3], fg: t => t.primary[1] },
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

    const { children, colorScheme = 'primary', invert, ...props } = this.props
    const { bg, fg } = colorSchemes[colorScheme]

    return (
      <SectionBleed py={2} bg={invert ? fg : bg} fg={invert ? bg : fg} {...props}>
        <div
        // Allows SectionBody margins to collapse with children
        >
          <SectionBody>{children}</SectionBody>
        </div>
      </SectionBleed>
    )
  }
}

export const SectionBleed = styled(Block)<SectionProps>`
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
