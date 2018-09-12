import _ from 'lodash'
import { rgba } from 'polished'
import React from 'react'

import { css, Styled, styled } from 'rt-theme'
import { colors } from 'rt-theme'

import { getColor } from '../tools'

import { H2, H3, H5, NumberedLayout } from '../elements'
import { Paragraph, SectionBlock, Text } from '../styled'

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

    <SectionBlock backgroundColor="white" mh={0} py={0}>
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
      <H2>Accents & Functional Colours</H2>
      <Paragraph>
        Accent colours inject focus points in to the UI and are used to give the UI character and guide users attention.
        These colours often work with the brand helping to retain the ‘feeling’ of being from the same organisation but
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
  codes = {}
}) => (
  <SwatchArea
    style={{
      boxShadow: `0 0 0 2px ${rgba(fg, 0.15)}`
    }}
  >
    {include.map((key, i) => {
      const color = palette[key]

      return (
        <Swatch
          className={css({
            gridArea: key,
            boxShadow: i < 1 && `0 0 2rem ${rgba(palette[include[include.length - 1]], 0.5)}`
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

export interface SwatchProps extends SwatchColorProps {
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
  <SwatchElement bg={bg} fg={fg} {...props}>
    <Text fontWeight="bold">{label}</Text>
    <Text textTransform="uppercase">{value}</Text>
    <Text opacity={0.75} fontSize={0.75} textTransform="uppercase">
      {code}
    </Text>
  </SwatchElement>
)

export const SwatchColor: Styled<SwatchColorProps> = styled.div`
  padding: 1.25rem;
  line-height: 1.25rem;

  display: flex;
  justify-content: flex-end;
  flex-flow: column nowrap;

  ${({ theme, bg, fg }) =>
    css({
      backgroundColor: getColor(theme, bg),
      color: getColor(theme, fg, theme.white)
    })};
`

export const LargeSwatchColor: Styled<SwatchColorProps> = styled(SwatchColor)`
  width: 14rem;
  height: 10rem;
  margin: 1.5rem 0;
  padding: 1.25rem;
  line-height: 1.25rem;

  display: flex;
  justify-content: flex-end;
  flex-flow: column nowrap;

  border-radius: 0.5rem;
`

const SwatchArea = styled.div`
  display: grid;

  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto;
  grid-template-areas:
    'base base base base'
    '1 2 3 4';

  overflow: hidden;
  border-radius: 0.5rem;

  ${SwatchColor} {
    min-height: 14rem;
    border-radius: initial;
  }
`

const ThemePalettes: React.SFC<{ theme: any }> = ({ theme: { primary, secondary }, ...props }) => {
  return (
    <ThemeRow>
      <CorePalette label="Core Primary" palette={primary} fg={secondary.base} />
      <CorePalette label="Core Secondary" palette={secondary} fg={primary.base} />
    </ThemeRow>
  )
}

const ThemeRow = styled.div`
  margin: 2rem 0;

  display: grid;
  grid-column-gap: 0.5rem;
  grid-template-columns: 1fr 1fr;

  ${SwatchArea}:first-child {
    border-radius: 0.5rem 0 0.5rem 0.5rem !important;
  }

  ${SwatchArea}:last-child {
    border-radius: 0 0.5rem 0.5rem 0.5rem !important;
  }
`
