import { styled } from 'rt-theme'

export interface ColorProps {
  color?: string
  backgroundColor?: string
}

export const DeliveryDate = styled('div')`
  color: ${({ theme }) => theme.textColor};
  font-size: 0.625rem;
  line-height: 1rem;
  opacity: 0.59;
`

export const TileSymbol = styled('div')`
  color: ${({ theme }) => theme.textColor};
  font-size: 0.8125rem;
  line-height: 1rem;
`

export const TileBaseStyle = styled('div')`
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: 3px;
  padding: 1.25rem;
  box-sizing: border-box;
`

export const Icon = styled('i')`
  color: ${({ theme }) => theme.white};
`

export const Button = styled('button')`
  border: none;
`
