import _ from 'lodash'
import { styled, css } from 'rt-theme'
import mapProps from '@evanrs/map-props'

import Block from './Block'

const flexPositions = [
  'stretch',
  /* Positional alignment */
  'center',
  'start',
  'end',
  'flex-start',
  'flex-end',
  'left',
  'right',
  /* Baseline alignment */
  'baseline',
  'first baseline',
  'last baseline',
  /* Overflow alignment */
  'safe center',
  'unsafe center',
  'safe',
  'unsafe',
  /* Global values */
  'inherit',
  'initial',
  'unset'
]

const alignPositions = [...flexPositions, 'normal', 'self-start', 'self-end']
const justifyPositions = [
  ...flexPositions,
  ['between', 'space-between'],
  ['around', 'space-around'],
  ['evenly', 'space-evenly']
]

const createMap = (prop, list) =>
  list.reduce((obj, pos) => {
    let alias
    if (_.isArray(pos)) {
      ;[alias, pos] = pos
      obj[alias] = css`
        ${prop}: ${pos};
      `
    }

    obj[pos] = css`
      ${prop}: ${pos};
    `

    return obj
  }, {})

const flexProps = {
  row: {
    default: css`
      flex-direction: row;
    `,
    nowrap: css`
      flex-direction: row;
      flex-wrap: nowrap;
    `,
    reverse: css`
      flex-direction: row;
      flex-wrap: wrap-reverse;
    `,
    wrap: css`
      flex-direction: row;
      flex-wrap: wrap;
    `
  },
  column: {
    default: css`
      flex-direction: column;
    `,
    nowrap: css`
      flex-direction: column;
      flex-wrap: nowrap;
    `,
    reverse: css`
      flex-direction: column;
      flex-wrap: wrap-reverse;
    `,
    wrap: css`
      flex-direction: column;
      flex-wrap: wrap;
    `
  },
  // align-items shorthand
  align: createMap('align-items', alignPositions),
  alignContent: createMap('align-content', alignPositions),
  alignItems: createMap('align-items', alignPositions),
  alignSelf: createMap('align-self', alignPositions),
  // justify-content shorthand
  justify: createMap('justify-content', justifyPositions),
  justifyContent: createMap('justify-content', justifyPositions),
  justifyItems: createMap('justify-items', justifyPositions),
  justifySelf: createMap('justify-self', justifyPositions),
  flex: {
    auto: css`
      flex: 1 1 auto;
    `,
    fill: css`
      flex: 1 1 0;
    `,
    // Take only the width
    width: css`
      flex: 0 0 auto;
    `,
    half: css`
      flex: 0.5 0.5 auto;
    `,
    third: css`
      flex: 0.33 0.33 auto;
    `,
    fourth: css`
      flex: 0.25 0.25 auto;
    `,
    fifth: css`
      flex: 0.2 0.2 auto;
    `,
    tenth: css`
      flex: 0.1 0.1 auto;
    `
  }
}

export const mapFlexProps = mapProps(flexProps)
export const mapFlexChildProps = mapProps(_.pick(flexProps, ['flex', 'alignSelf', 'justifySelf']))

// Only for stable props, ie, not numeric, known ahead of time
export const Flex = styled(Block)`
  display: flex;
  ${mapFlexProps};
`

export const FlexChild = styled(Block)`
  ${mapFlexChildProps};
`

export const Fill = styled(Flex)`
  ${mapProps({
    scale: {
      1: css`
        min-width: 0.5rem;
        min-height: 0.5rem;
      `,
      2: css`
        min-width: 1rem;
        min-height: 1rem;
      `,
      3: css`
        min-width: 2rem;
        min-height: 2rem;
      `,
      4: css`
        min-width: 3rem;
        min-height: 3rem;
      `,
      5: css`
        min-width: 4rem;
        min-height: 4rem;
      `,
      default(number: number | string) {
        return css`
          min-width: ${Number(number)}rem;
          min-height: ${Number(number)}rem;
        `
      }
    }
  })};
`

export default Flex
