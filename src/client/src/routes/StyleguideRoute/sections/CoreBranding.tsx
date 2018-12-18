import _ from 'lodash'
import { rgba } from 'polished'
import React from 'react'

import { H2, H3, H5, NumberedLayout } from '../elements'
import { Block, BlockProps, Paragraph, SectionBlock, Text } from '../styled'
import { colors, styled, Theme } from 'test-theme'
import { StyledComponent } from 'styled-components'

export default () => (
  <React.Fragment>
    <SectionBlock intent="secondary" mh={3}>
      <NumberedLayout number="1">
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

      <H3 mt={4}>Light</H3>
      <ThemePalettes theme={colors.light} />

      <H3 mt={4}>Dark</H3>
      <ThemePalettes theme={colors.dark} />
    </SectionBlock>

    <SectionBlock mh={3}>
      <QuadrantLayout>
        <span>
          <H2>Accents & Functional colors</H2>
          <Paragraph mb={3}>
            Accent colors inject focus points in to the UI and are used to give the UI character and guide users
            attention. These colors often work with the brand helping to retain the ‘feeling’ of being from the same
            organisation but not always.
          </Paragraph>
        </span>

        <AccentPalettes accents={colors.accents} />

        <span>
          <H2>Unique Collections</H2>
          <Paragraph>
            Create separate references for key areas of the application such as trading directions shown below.
          </Paragraph>
        </span>

        <UniquePalettes
          palettes={{
            'Trading Buy': { base: colors.accents.accent.base },
            'Trading Sell': { base: colors.accents.bad.base },
          }}
        />
      </QuadrantLayout>
    </SectionBlock>
  </React.Fragment>
)

const PaletteLayout: React.SFC<{
  grid?: StyledComponent<React.ComponentType<any>, Theme, any>
  fg: string
  label: string
  palette: any
  include?: any[]
  codes?: object
}> = ({ grid: SwatchGrid, fg, label: paletteLabel, palette, include = ['base', 1, 2, 3, 4], codes = {} }) => (
  <SwatchGrid
    style={{
      boxShadow: `0 0 0 4px ${rgba(fg, 0.05)}`,
    }}
  >
    {include.map((key, i) => {
      const color = palette[key]

      return (
        <Swatch
          key={key}
          style={{
            gridArea: key,
            boxShadow: i < 1 && `0 0 2rem ${rgba(palette[include[include.length - 1]], 0.5)}`,
          }}
          label={`${paletteLabel} ${key}`}
          value={color}
          code={codes[key] || key}
          bg={color}
          fg={fg}
        />
      )
    })}
  </SwatchGrid>
)

export interface SwatchColorProps {
  bg?: string
  fg?: string
}

export interface SwatchProps extends BlockProps, SwatchColorProps {
  className?: string
  style?: object
  is?: StyledComponent<React.ComponentType<any>, Theme, SwatchColorProps>
  label?: string
  value?: string
  code?: string
  toStyle?: React.CSSProperties
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

export const SwatchColor = styled(Block)<SwatchColorProps>`
  line-height: 1.25rem;

  display: flex;
  justify-content: flex-end;
  flex-flow: column nowrap;
`

export const LargeSwatchColor = styled(SwatchColor)<SwatchColorProps>`
  width: 14rem;
  height: 10rem;
  margin: 1.5rem 0;

  display: flex;
  justify-content: flex-end;
  flex-flow: column nowrap;

  border-radius: 0.5rem;
`

const CoreSwatchGrid = styled.div`
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
    }
  }
`

const ThemePalettes: React.SFC<{ theme: any }> = ({ theme: { primary, secondary }, ...props }) => {
  return (
    <ThemeRow>
      <PaletteLayout grid={CoreSwatchGrid} label="Primary" palette={primary} fg={secondary.base} />
      <PaletteLayout grid={CoreSwatchGrid} label="Secondary" palette={secondary} fg={primary.base} />
    </ThemeRow>
  )
}

const ThemeRow = styled.div`
  margin: 2rem 0;

  display: grid;
  grid-gap: 0.5rem;
  @media all and (min-width: 640px) {
    grid-template-columns: 1fr 1fr;

    ${CoreSwatchGrid}:first-child {
      border-radius: 0.5rem 0 0.5rem 0.5rem !important;
    }

    ${CoreSwatchGrid}:last-child {
      border-radius: 0 0.5rem 0.5rem 0.5rem !important;
    }
  }
`

const QuadrantLayout = styled.div`
  display: grid;
  grid-row-gap: 1rem;
  grid-column-gap: 2rem;

  grid-template-rows: auto;
  grid-template-columns: minmax(50%, 1fr) auto;
  grid-template-areas:
    'a1 b1'
    'a2 b2 ';

  & > :nth-child(1) {
    grid-area: a1;
  }
  & > :nth-child(2) {
    grid-area: a2;
  }
  & > :nth-child(3) {
    grid-area: b1;
  }
  & > :nth-child(4) {
    grid-area: b2;
  }

  @media all and (max-width: 800px) {
    grid-template-columns: auto;
    grid-template-areas:
      'a1'
      'a2'
      'b1'
      'b2';
    grid-row-gap: 2rem;
  }
`

const AccentPalettes: React.SFC<{ accents: any }> = ({ accents, ...props }) => {
  return (
    <AccentRowGrid>
      {_.map(accents, (accent, label: string) => (
        <PaletteLayout
          key={label}
          grid={AccentSwatchGrid}
          label={label}
          palette={accent}
          fg="#FFF"
          include={['base', '1', '2']}
        />
      ))}
    </AccentRowGrid>
  )
}

const AccentRowGrid = styled.div`
  max-width: 30rem;

  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: repeat(4, minmax(calc(25% - 0.5rem), 7rem));
`

const AccentSwatchGrid = styled.div`
  border-radius: 0.5rem;
  overflow: hidden;
  display: grid;
  grid-template-rows: repeat(3, 8rem);
  grid-template-areas:
    'base'
    '1'
    '2';
`

const UniquePalettes: React.SFC<{ palettes: any }> = ({ palettes, ...props }) => {
  return (
    <UniqueRowGrid>
      {_.map(palettes, (palette, label: string) => (
        <PaletteLayout
          key={label}
          grid={UniqueSwatchGrid}
          label={label}
          palette={palette}
          fg="#FFF"
          include={['base']}
        />
      ))}
    </UniqueRowGrid>
  )
}

const UniqueRowGrid = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: repeat(2, minmax(calc(25% - 0.5rem), 7rem));
`

const UniqueSwatchGrid = styled.div`
  border-radius: 0.5rem;
  overflow: hidden;
  height: min-content;
  display: grid;
  grid-template-rows: 8rem;
  grid-template-areas: 'base';
`
