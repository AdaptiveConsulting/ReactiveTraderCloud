import { styled } from 'rt-util'

export interface ColorProps {
  color?: string
  backgroundColor?: string
}

export const DeliveryDate = styled('div')`
  color: ${({ theme: { text } }) => text.textMeta};
  font-size: 0.625rem;

  .spot-tile:hover & {
    color: ${({ theme: { text } }) => text.textPrimary};
  }
`

export const TileSymbol = styled('div')`
  color: ${({ theme: { text } }) => text.textPrimary};
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

export const Icon = styled('i')<ColorProps>`
  color: ${({ theme: { text }, color }) => color && text[color]};
`

export const Button = styled('button')`
  font-family: Lato;
  border: none;
`
