import React from 'react'

import { colors, styled, DarkShade, LightShade, ColorPalette } from 'rt-theme'

import { Block, BlockProps } from '../styled'
import { readableColor, transparentize } from 'polished'
import { css } from 'styled-components'
import ColorClipboard, { CopyToClipboardWrapper } from './ColorToClipboard'

const { brand, offblack, blue, red, yellow, green } = colors.spectrum
const LIGHT_SHADES: LightShade[] = ['L95', 'L9', 'L8', 'L7', 'L6', 'L5', 'L4', 'L3', 'L2', 'L1']
const DARK_SHADES: DarkShade[] = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D95']
const textColor = (c: string) => transparentize(0.6, readableColor(c))

export const ColorBlocks = () => (
  <Root>
    {[{ brand, offblack }, { blue, red, yellow, green }].map((paletteGroup, groupIndex) => (
      <SwatchSetGroup key={groupIndex}>
        {Object.keys(paletteGroup).map(paletteName => {
          const palette = paletteGroup[paletteName] as ColorPalette

          return (
            <SwatchSet key={paletteName}>
              <ShadeSwatchStrip shadeSet={LIGHT_SHADES} palette={palette} />

              <SwatchGroup py={2}>
                <Swatch bg={_ => palette.base}>
                  <ColorClipboard color={palette.base} iconColor={textColor(palette.base)} />
                  <SwatchName>{paletteName}</SwatchName>
                  <SwatchValue>{palette.base}</SwatchValue>
                </Swatch>
              </SwatchGroup>

              <ShadeSwatchStrip shadeSet={DARK_SHADES} palette={palette} />
            </SwatchSet>
          )
        })}
      </SwatchSetGroup>
    ))}
  </Root>
)

const ShadeSwatchStrip: React.FC<{ shadeSet: Array<LightShade | DarkShade>; palette: ColorPalette }> = ({
  shadeSet,
  palette,
}) => (
  <SwatchGroup>
    {shadeSet.map(shadeName => {
      const color = palette[shadeName]
      const fgColor = textColor(color)
      return (
        <Swatch key={shadeName} bg={_ => color}>
          <ColorClipboard color={color} iconColor={fgColor} />
          <SwatchShadeName fg={_ => fgColor}>{shadeName}</SwatchShadeName>
          <SwatchValue fg={_ => fgColor}>{color}</SwatchValue>
        </Swatch>
      )
    })}
  </SwatchGroup>
)

const SwatchName = styled(Block)<BlockProps>`
  font-weight: bold;
  font-size: 0.825rem;
  text-transform: capitalize;
`

const SwatchValue = styled(SwatchName)`
  font-size: 0.875rem;
  font-weight: 400;
  text-transform: uppercase;
`

const SwatchShadeName = styled(SwatchName)`
  font-size: 0.75rem;
`

const Swatch = styled(Block)<BlockProps>`
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-flow: column nowrap;
  min-height: 5rem;
  max-height: 5rem;
  min-width: 7rem;
  max-width: 7rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.85);
  padding: 1rem;

  @media all and (max-width: 800px) {
    min-width: 6rem;
    max-width: 6rem;
  }

  &:hover {
    ${CopyToClipboardWrapper} {
      visibility: visible;
    }
  }
`

const SwatchGroup = styled(Block)`
  ${Swatch}:first-of-type {
    border-radius: 0.75rem 0.75rem 0 0;
  }

  ${Swatch}:last-of-type {
    border-radius: 0 0 0.75rem 0.75rem;
  }

  ${Swatch}:first-of-type:last-of-type {
    border-radius: 0.75rem;
  }
`

const SwatchSet = styled(Block)`
  height: 100%;
`

const SwatchSetGroup = styled(Block)<BlockProps & { children: any[] }>`
  display: grid;
  height: 100%;

  grid-column-gap: 0.5rem;
  ${({ children }) => css`
    grid-template-columns: repeat(${children.length || 1}, 1fr);
  `};
`

const Root = styled.div`
  margin: 1rem 0;

  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto;
  grid-gap: 2rem;

  max-width: 100%;
`

export default ColorBlocks
