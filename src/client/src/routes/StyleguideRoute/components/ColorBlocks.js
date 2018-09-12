import _ from 'lodash'
import React from 'react'
import { styled, css } from 'rt-theme'
import mapp from '@evanrs/map-props'

import { colors } from 'rt-theme'
import Block from '../styled/Block'

const { spectrum, accents, light, dark } = colors

const SWATCH_KEYS = {
  light: [95, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(v => `L${v}`),
  dark: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => `D${v}`)
}

const ColorBlocks = props => {
  const { brand, offblack, blue, red, yellow, green } = spectrum
  return (
    <Root>
      {[{ brand, offblack }, { blue, red, yellow, green }].map((swatchSetGroup, i) => (
        <SwatchSetGroup key={i}>
          {_.map(swatchSetGroup, (color, name) => {
            let base = color.base
            let light = SWATCH_KEYS.light.map(key => ({ color: color[key], name: key }))
            let dark = SWATCH_KEYS.dark.map(key => ({ color: color[key], name: key }))

            const set = [...light, { color: base }, ...dark]

            return (
              <SwatchSet key={name}>
                <SwatchGroup glow={base}>
                  {light.map(({ color, name }, index) => {
                    const { [index + 4]: text = { color: 'transparent' } } = set

                    return (
                      <Swatch key={name} backgroundColor={color}>
                        <SwatchLevel color={text.color}>{name}</SwatchLevel>
                      </Swatch>
                    )
                  })}
                </SwatchGroup>

                <SwatchGroup py={2}>
                  <Swatch backgroundColor={base}>
                    <SwatchName>{name}</SwatchName>
                    <SwatchValue>{base}</SwatchValue>
                  </Swatch>
                </SwatchGroup>

                <SwatchGroup glow={base}>
                  {dark.map(({ color, name }, index) => {
                    const {
                      [dark.length + index - 4]: text = {
                        color: 'transparent'
                      }
                    } = set

                    return (
                      <Swatch key={name} backgroundColor={color}>
                        <SwatchLevel color={text.color}>{name}</SwatchLevel>
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
  ${mapp({
    color: color => `color: ${color}`
  })};
`

const SwatchValue = styled(SwatchName)`
  font-size: 0.875rem;
  font-weight: 400;
  text-transform: uppercase;
`

const SwatchLevel = styled(SwatchName)`
  font-size: 0.75rem;
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

  ${mapp({
    backgroundColor: {
      ..._.mapValues(
        colors,
        color =>
          css`
            background-color: ${color};
          `
      ),
      default: (color, key, { theme }) => {
        return css`
          background-color: ${color};
        `
      }
    }
  })};
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

  ${true
    ? null
    : mapp({
        glow: glow => {
          return css`
            position: relative;
            margin-left: 2px;

            &::before {
              display: block;
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              box-shadow: 0 0 0 2px ${glow};
              border-radius: 0.625rem;
              opacity: 0.1;
            }
          `
        }
      })};
`

const SwatchSet = styled(Block)`
  height: 100%;
`

const SwatchSetGroup = styled(Block)`
  display: grid;
  height: 100%;

  grid-column-gap: 0.5rem;
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

const sort = ({ base, ...colors }) => {
  return _.reduce(
    colors,
    (acc, color, name) => {
      let [type, level, notch] = [...name.split(''), 0]
      let key = Number(`${level}${notch}`)

      acc[/d/i.test(type) ? 'dark' : /l/i.test(type) ? 'light' : /a/i.test(type) ? 'alpha' : 'unknown'][key] = {
        color,
        name
      }

      return acc
    },
    {
      base,
      dark: {},
      light: {},
      alpha: {},
      unknown: {}
    }
  )
}

export default ColorBlocks
