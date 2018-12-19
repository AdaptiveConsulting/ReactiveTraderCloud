import _ from 'lodash'
import React from 'react'
import { css, styled } from 'rt-theme'
import ColorClipBoard, { ClipBoardWrapper } from './ColorClipBoard'

import { colors } from 'rt-theme'

import { Block, BlockProps } from '../styled'

const {
  spectrum: { brand, offblack, blue, red, yellow, green },
} = colors

const SWATCH_KEYS = {
  light: [95, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(v => `L${v}`),
  dark: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => `D${v}`),
}

export const ColorBlocks = () => (
  <Root>
    {[{ brand, offblack }, { blue, red, yellow, green }].map((swatchSetGroup, groupKey) => (
      <SwatchSetGroup key={groupKey}>
        {_.map(swatchSetGroup, (group, setKey) => {
          const base = group.base
          const light = SWATCH_KEYS.light.map(key => ({ color: group[key], name: key }))
          const dark = SWATCH_KEYS.dark.map(key => ({ color: group[key], name: key }))

          const set = [...light, { color: base }, ...dark]
          return (
            <SwatchSet key={setKey}>
              <SwatchGroup>
                {light.map(({ color, name }, index) => {
                  const { [index + 4]: text = { color: 'transparent' } } = set

                  return (
                    <Swatch key={name} bg={color}>
                      <ColorClipBoard color={color} />
                      <SwatchLevel fg={text.color}>{name}</SwatchLevel>
                    </Swatch>
                  )
                })}
              </SwatchGroup>

              <SwatchGroup py={2}>
                <Swatch bg={base}>
                  <ColorClipBoard color={base} />
                  <SwatchName>{name}</SwatchName>
                  <SwatchValue>{base}</SwatchValue>
                </Swatch>
              </SwatchGroup>

              <SwatchGroup>
                {dark.map(({ color, name }, index) => {
                  const {
                    [dark.length + index - 4]: text = {
                      color: 'transparent',
                    },
                  } = set

                  return (
                    <Swatch key={name} bg={color}>
                      <ColorClipBoard color={color} />
                      <SwatchLevel fg={text.color}>{name}</SwatchLevel>
                    </Swatch>
                  )
                })}
              </SwatchGroup>
            </SwatchSet>
          )
        })}
      </SwatchSetGroup>
    ))}
  </Root>
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

const SwatchLevel = styled(SwatchName)`
  font-size: 0.75rem;
`

const Swatch = styled(Block)<BlockProps>`
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
    ${ClipBoardWrapper} {
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
