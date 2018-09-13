import mapp from '@evanrs/map-props'
import _ from 'lodash'
import { css } from 'rt-theme'

// export type PropValue = number | string | boolean
export type PropValue = any

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

export interface MarginPaddingProps extends MarginProps, PaddingProps {}

export const { marginPaddingProps, mapMarginPaddingProps } = (() => {
  const [margin, padding]: MarginPaddingProps[] = ['margin', 'padding'].map(prop =>
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
        const name = `${group}${index}`
        const rule = css`
          ${variants.map(
            variant =>
              css`
                ${prop + '-' + variant}: ${value}rem;
              `,
          )};
        `

        acc[group] = acc[group] || {}
        acc[name] = acc[group][index] = rule
      })

      return acc
    }, {}),
  )

  margin.mx.auto = css`
    margin-left: auto;
    margin-right: auto;
  `
  margin.ml.auto = css`
    margin-left: auto;
  `
  margin.mr.auto = css`
    margin-right: auto;
  `

  const marginPaddingProps = { ...margin, ...padding }

  return {
    marginPaddingProps,
    mapMarginPaddingProps: mapp(marginPaddingProps),
  }
})()

export default mapMarginPaddingProps
