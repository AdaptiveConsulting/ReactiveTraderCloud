/* An implementation of Styled System m*, p* for maring padding props
 * https://jxnblk.com/styled-system/getting-started#margin--padding
 */

import _ from 'lodash'

export type PropValue = 0 | 1 | 2 | 3 | 4 | 5

export interface MarginProps {
  m?: PropValue
  mx?: PropValue | 'auto'
  my?: PropValue
  mt?: PropValue
  mr?: PropValue | 'auto'
  mb?: PropValue
  ml?: PropValue | 'auto'
}

export interface PaddingProps {
  p?: PropValue
  px?: PropValue
  py?: PropValue
  pt?: PropValue
  pr?: PropValue
  pb?: PropValue
  pl?: PropValue
}

export interface MarginPaddingProps extends MarginProps, PaddingProps {
  [key: string]: any
}

type MarginPaddingRules = { [key in keyof MarginPaddingProps]?: { [key: string]: string } }

export const { marginPaddingProps, mapMarginPaddingProps } = (() => {
  const [margin, padding]: MarginPaddingRules[] = ['margin', 'padding'].map(prop =>
    [
      ['', 'left', 'right', 'top', 'bottom'],
      ['x', 'left', 'right'],
      ['l', 'left'],
      ['r', 'right'],
      ['y', 'top', 'bottom'],
      ['t', 'top'],
      ['b', 'bottom'],
    ].reduce((acc, [axis, ...variants]) => {
      ;[0, 0.5, 1, 2, 3, 4].forEach((value, index) => {
        const group = `${prop[0]}${axis}`
        const rule = variants.map(variant => `${prop + '-' + variant}: ${value}rem;`).join('')

        acc[group] = acc[group] || {}
        acc[group][index] = rule
      })

      return acc
    }, {}),
  )

  margin.mx.auto = `
    margin-left: auto;
    margin-right: auto;
  `
  margin.ml.auto = `
    margin-left: auto;
  `
  margin.mr.auto = `
    margin-right: auto;
  `

  padding.px.viewport = `
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
  `

  const marginPaddingProps = {
    ...margin,
    ...padding,
  }

  const mapMarginPaddingProps = (props: MarginPaddingProps) => {
    return _.map(props, (v, k) => (k[0] === 'p' || k[0] === 'm') && _.get(marginPaddingProps, [k, v], false))
      .filter(x => x)
      .join(';')
  }

  return {
    marginPaddingProps,
    mapMarginPaddingProps,
  }
})()

export default mapMarginPaddingProps
