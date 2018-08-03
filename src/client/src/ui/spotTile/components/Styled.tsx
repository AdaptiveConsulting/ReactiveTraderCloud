import { styled } from 'rt-util'

export const DeliveryDate = styled('div')`
  color: ${({ theme: { text } }) => text.textMeta};
  font-size: 10px;
`

export const TileSymbol = styled('div')`
  color: ${({ theme: { text } }) => text.textPrimary};
  font-size: 13px;
`

export const TileBaseStyle = styled('div')`
  height: 100%;
  border-radius: 3px;
  padding: 18px;
  box-sizing: border-box;
`
