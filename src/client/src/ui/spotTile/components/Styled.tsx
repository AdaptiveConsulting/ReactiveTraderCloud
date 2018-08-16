import { styled } from 'rt-util'

export interface ColorProps {
  color?: string
  backgroundColor?: string
}

export const DeliveryDate = styled('div')<{ theme?: any }>`
  color: ${({ theme }) => theme.textColor};
  font-size: 0.625rem;
  opacity: 0.59;
`

export const TileSymbol = styled('div')<{ theme?: any }>`
  color: ${({ theme }) => theme.textColor};
  font-size: 0.8125rem;
`

export const TileBaseStyle = styled('div')`
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: 3px;
  padding: 1.25rem;
  box-sizing: border-box;
`

export const Icon = styled('i')<{ theme?: any }>`
  color: ${({ theme }) => theme.iconColor};
`

export const Button = styled('button')`
  font-family: Lato;
  border: none;
`
