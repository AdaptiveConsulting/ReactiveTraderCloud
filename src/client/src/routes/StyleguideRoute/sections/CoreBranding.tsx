import _ from 'lodash'
import { rgba } from 'polished'
import React from 'react'

import { css, Styled, styled } from 'rt-theme'
import { colors } from 'rt-theme'

import { H2, H3, H5, NumberedLayout } from '../elements'
import { Block, BlockProps, Paragraph, SectionBlock, Text } from '../styled'

export const layout = React.Fragment
export const props = {}

export default () => (
  <React.Fragment>
    <SectionBlock intent="secondary" mh={3}>
      <NumberedLayout number="2">
        <H5>Design Systems</H5>
        <H3>Adaptive UI Library</H3>
        <Paragraph>Sets the visual tone of the user interface defining the color and font styles to be used.</Paragraph>
      </NumberedLayout>
    </SectionBlock>

    <SectionBlock mh={0} py={0}>
      <Paragraph>
        <i>
          <strong>Tip</strong>: Colors used can and will change in a UI therefore resist the temptation to reference the
          color in the style name. Instead name the color according to its hierarchy in the UI. For example primary,
          secondary, tertiary, accent-usage-type etc.
        </i>
      </Paragraph>
    </SectionBlock>
    <div>
      <SectionBlock intent="secondary" mh={0.125 / 5} py={0} />
    </div>

    <SectionBlock mh={3}>
      <H2 pt={4}>Brand Colors</H2>
      <Paragraph>Brand colors aim to communicate a companies visual ownership of the digital product.</Paragraph>
      <Swatch
        is={LargeSwatchColor}
        label="Brand Primary"
        value={colors.spectrum.brand.base}
        bg="brand.base"
        fg="white"
        code="Base"
      />
    </SectionBlock>

    <SectionBlock mh={3}>
      <H2>Core UI</H2>
      <Paragraph>
        Core color control the general look and feel of the application and make up 90% of the overall UI aesthetic.
        When switching from a light to a dark theme these are the key color that change.
      </Paragraph>

      <H3>Light</H3>
      <ThemePalettes theme={colors.light} />

      <H3>Dark</H3>

      <ThemePalettes theme={colors.dark} />
    </SectionBlock>

    <SectionBlock mh={3}>
      <H2>Accents & Functional colors</H2>
      <Paragraph>
        Accent colors inject focus points in to the UI and are used to give the UI character and guide users attention.
        These colors often work with the brand helping to retain the ‘feeling’ of being from the same organisation but
        not always.
      </Paragraph>

      {
        // List themes in primary secondary palettes
      }
    </SectionBlock>

    <SectionBlock mh={3}>
      <H2>Unique Collections</H2>
      <Paragraph>
        Create separate references for key areas of the application such as trading directions shown below.
      </Paragraph>

      {
        // List trading buy / sell
      }
      <Paragraph>
        <strong />
      </Paragraph>
    </SectionBlock>
  </React.Fragment>
)

const CorePalette: React.SFC<{ fg: string; label: string; palette: any; include?: any[]; codes?: object }> = ({
  fg,
  label: paletteLabel,
  palette,
  include = ['base', 1, 2, 3, 4],
  codes = {},
}) => (
  <SwatchArea
    style={{
      boxShadow: `0 0 0 4px ${rgba(fg, 0.05)}`,
    }}
  >
    {include.map((key, i) => {
      const color = palette[key]

      return (
        <Swatch
          key={key}
          className={css({
            gridArea: key,
            boxShadow: i < 1 && `0 0 2rem ${rgba(palette[include[include.length - 1]], 0.5)}`,
          })}
          label={`${paletteLabel} ${key}`}
          value={color}
          code={codes[key] || key}
          bg={color}
          fg={fg}
        />
      )
    })}
  </SwatchArea>
)

export interface SwatchColorProps {
  bg?: string
  fg?: string
}

export interface SwatchProps extends BlockProps, SwatchColorProps {
  className?: string
  style?: object
  is?: Styled<SwatchColorProps>
  label?: string
  value?: string
  code?: string
}

export const Swatch: React.SFC<SwatchProps> = ({
  is: SwatchElement = SwatchColor,
  label,
  value,
  code,
  bg,
  fg,
  ...props
}) => (
  <SwatchElement p={2} bg={bg} fg={fg} {...props}>
    <Text fontSize={0.8125} fontWeight="bold" textTransform="capitalize">
      {label}
    </Text>
    <Text fontSize={0.8125} textTransform="uppercase">
      {value}
    </Text>
    {/* <Text fontSize={0.75} textTransform="uppercase" opacity={0.75}>
      {code}
    </Text> */}
  </SwatchElement>
)

export const SwatchColor: Styled<SwatchColorProps> = styled(Block)`
  line-height: 1.25rem;

  display: flex;
  justify-content: flex-end;
  flex-flow: column nowrap;
`

export const LargeSwatchColor: Styled<SwatchColorProps> = styled(SwatchColor)`
  width: 14rem;
  height: 10rem;
  margin: 1.5rem 0;

  display: flex;
  justify-content: flex-end;
  flex-flow: column nowrap;

  border-radius: 0.5rem;
`

const SwatchArea = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(4, 5rem);
  grid-template-areas:
    'base 1'
    'base 2'
    'base 3'
    'base 4';

  overflow: hidden;
  border-radius: 0.5rem;

  ${SwatchColor} {
    border-radius: initial;
  }

  @media all and (min-width: 640px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: auto;
    grid-template-areas:
      'base base base base'
      '1 2 3 4';

    ${SwatchColor} {
      min-height: 14rem;
      &:nth-child(n + 2) {
        /* @media all and (max-width: 640px) {
        text-orientation: sideways;
        writing-mode: vertical-rl;
        text-align: right;
      } */
      }
    }
  }
`

const ThemePalettes: React.SFC<{ theme: any }> = ({ theme: { primary, secondary }, ...props }) => {
  return (
    <ThemeRow>
      <CorePalette label="Primary" palette={primary} fg={secondary.base} />
      <CorePalette label="Secondary" palette={secondary} fg={primary.base} />
    </ThemeRow>
  )
}

const ThemeRow = styled.div`
  margin: 2rem 0;

  display: grid;
  grid-gap: 0.5rem;
  @media all and (min-width: 640px) {
    grid-template-columns: 1fr 1fr;

    ${SwatchArea}:first-child {
      border-radius: 0.5rem 0 0.5rem 0.5rem !important;
    }

    ${SwatchArea}:last-child {
      border-radius: 0 0.5rem 0.5rem 0.5rem !important;
    }
  }
`
