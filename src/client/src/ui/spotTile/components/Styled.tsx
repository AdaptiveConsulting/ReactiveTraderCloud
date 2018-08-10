import { styled } from 'rt-util'

export interface ColorProps {
  color?: string
  backgroundColor?: string
}

export const DeliveryDate = styled('div')`
  color: ${({ theme: { text } }) => text.textMeta};
  font-size: 10px;

  .spot-tile:hover & {
    color: ${({ theme: { text } }) => text.textPrimary};
  }
`

export const TileSymbol = styled('div')`
  color: ${({ theme: { text } }) => text.textPrimary};
  font-size: 13px;
`

export const TileBaseStyle = styled('div')`
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: 3px;
  padding: 20px;
  box-sizing: border-box;
`

export const Icon = styled('i')<ColorProps>`
  color: ${({ theme: { text }, color }) => color && text[color]};
`

export const Button = styled('button')`
  font-family: Lato;
  border: none;
`

export const Circle = styled('div')`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`
