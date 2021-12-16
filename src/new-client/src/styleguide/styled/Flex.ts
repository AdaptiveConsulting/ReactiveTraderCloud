import styled, { css } from 'styled-components'

interface FlexProperties {
  height?: string
  width?: string
  direction?: 'column' | 'row'
  wrap?: string
  justifyContent?: 'center' | 'flex-start' | 'flex-end' | 'space-between'
  alignItems?: 'center' | 'stretch' | 'flex-end' | 'flex-start'
}

export const flexStyle = ({ direction, wrap, justifyContent, alignItems }: FlexProperties) =>
  css`
    display: flex;
    flex-direction: ${direction};
    flex-wrap: ${wrap};
    justify-content: ${justifyContent};
    align-items: ${alignItems};
  `

interface BoxDimentions {
  height?: string
  width?: string
}
export const boxStyle = ({ height, width }: BoxDimentions) =>
  css`
    height: ${height};
    width: ${width};
  `

export const Box = styled('div')`
  ${boxStyle};
`

export const Flex = styled(Box)`
  ${flexStyle};
`
