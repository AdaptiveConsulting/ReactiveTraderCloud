import { RouteStyle } from 'rt-components'
import { testStyled } from 'test-theme'

export interface ColorProps {
  color?: string
  backgroundColor?: string
}

export const DeliveryDate = testStyled.div`
  color: ${({ theme }) => theme.tile.textColor};
  font-size: 0.625rem;
  line-height: 1rem;
  opacity: 0.59;
`

export const TileSymbol = testStyled.div`
  color: ${({ theme }) => theme.tile.textColor};
  font-size: 0.8125rem;
  line-height: 1rem;
`

export const TileBaseStyle = testStyled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: 3px;
  padding: 1.25rem;
  box-sizing: border-box;

  ${RouteStyle} & {
    border-radius: 0px;
  }
`

export const Icon = testStyled('i')`
  color: ${({ theme }) => theme.white};
`

export const Button = testStyled('button')`
  border: none;
`

export const TileHeader = testStyled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
