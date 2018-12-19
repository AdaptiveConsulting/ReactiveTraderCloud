import { css } from 'styled-components'
import { styled } from 'rt-theme'

interface Flex {
  height?: string
  width?: string
  direction?: 'column' | 'row'
  wrap?: string
  justifyContent?: 'center' | 'flex-start' | 'flex-end' | 'space-between'
  alignItems?: 'center' | 'stretch' | 'flex-end' | 'flex-start'
}

// const bg = (color: string) => {
//   return css<hhh>`
//     background-color: ${color}
//   `;
// }

// interface ButtonProps {
//   primary: boolean;
// }
// const StyledButton = styled('button')<ButtonProps>`
// `

// const Button = ({ primary, ...rest }) => (
//   <StyledButton primary={primary} {...rest} />
// )
export const flexStyle = ({ direction, wrap, justifyContent, alignItems }: Flex) =>
  css`
    display: flex;
    flex-direction: ${direction};
    flex-wrap: ${wrap};
    justify-content: ${justifyContent};
    align-items: ${alignItems};
  `

interface Box {
  height?: string
  width?: string
}
export const boxStyle = ({ height, width }: Box) =>
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
