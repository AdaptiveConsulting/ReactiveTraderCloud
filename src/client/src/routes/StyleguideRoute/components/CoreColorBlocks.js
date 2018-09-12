import _ from 'lodash'
import React from 'react'
import { styled, css } from 'rt-theme'
import mapp from '@evanrs/map-props'

import { colors } from 'rt-theme'
import Block from '../styled/Block'

const { spectrum, accents, light, dark } = colors

const CoreColorBlocks = props => {
  const { brand, offblack, blue, red, yellow, green } = spectrum
  return (
    <Root>
      {[{ brand, offblack }, { blue, red, yellow, green }].map((swatchSetGroup, i) => (
        <SwatchSetGroup key={i}>
          {_.map(swatchSetGroup, (color, name) => {
            const { base, light, dark, unknown } = sort(color)

            return (
              <SwatchSet key={name}>
                <SwatchGroup>
                  {_.values(light)
                    .reverse()
                    .map(({ color, name }, key) => {
                      return (
                        <Swatch key={name} backgroundColor={color}>
                          <SwatchName>{name}</SwatchName>
                        </Swatch>
                      )
                    })}
                </SwatchGroup>

                <Block p={1} />

                <SwatchGroup>
                  <Swatch backgroundColor={base}>
                    <SwatchName>{name}</SwatchName>
                    <SwatchValue>{base}</SwatchValue>
                  </Swatch>
                </SwatchGroup>

                <Block p={1} />
                <SwatchGroup>
                  {_.map(dark, ({ color, name }, key) => {
                    return (
                      <Swatch key={name} backgroundColor={color}>
                        <SwatchName>{name}</SwatchName>
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
}

const SwatchName = styled.div`
  font-family: Lato, sans-serif;
  font-weight: bold;
  font-size: 0.825rem;
  text-transform: capitalize;
`

const SwatchValue = styled.div`
  font-size: 0.875rem;
  text-transform: uppercase;
`

const Swatch = styled(props => <Block px={2} {...props} />)`
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
`

const SwatchGroup = styled(Block)`
  ${Swatch}:first-of-type {
    border-radius: 0.5rem 0.5rem 0 0;
  }

  ${Swatch}:last-of-type {
    border-radius: 0 0 0.5rem 0.5rem;
  }

  ${Swatch}:first-of-type:last-of-type {
    border-radius: 0.5rem;
  }
`

const SwatchSet = styled(Block)`
  height: 100%;
`

const SwatchSetGroup = styled(Block)`
  display: grid;
  height: 100%;

  grid-column-gap: 0.25rem;
  ${({ children }) => css`
    grid-template-columns: repeat(${children.length || 1}, 1fr);
  `};
`

const Root = styled.div`
  display: flex;
  flex-flow: row wrap;
  margin: 1rem 0;

  ${SwatchSetGroup} + ${SwatchSetGroup} {
    padding-left: 2rem;
  }
`

export default CoreColorBlocks
