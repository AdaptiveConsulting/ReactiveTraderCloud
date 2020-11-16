import { RouteStyle } from 'rt-components'
import styled from 'styled-components/macro'
import { TopRightButton } from './TileControls'
import { ActionButton } from './TileHeader'
import { TradeButton } from './PriceButton/styled'
export interface ColorProps {
  color?: string
  backgroundColor?: string
}

export const DeliveryDate = styled.div`
  color: ${({ theme }) => theme.core.textColor};
  font-size: 0.625rem;
  line-height: 1rem;
  opacity: 0.59;
  margin-left: auto;
  transition: margin-right 0.2s;
`

export const TileSymbol = styled.div`
  color: ${({ theme }) => theme.core.textColor};
  font-size: 0.8125rem;
  line-height: 1rem;
`

export const TileBaseStyle = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: 3px;
  padding: 1.25rem;
  box-sizing: border-box;

  &:hover ${TradeButton} {
    background-color: ${({ theme }) => theme.core.darkBackground};
  }
  ${RouteStyle} & {
    border-radius: 0px;
  }
`

export const Icon = styled('i')`
  color: ${({ theme }) => theme.white};
`

export const Button = styled('button')`
  border: none;
`

export const TileHeader = styled.div`
  display: flex;
  align-items: center;
`

export const TileWrapperBase = styled.div<{ shouldMoveDate: boolean }>`
  position: relative;
  &:hover ${TopRightButton} {
    opacity: 0.75;
  }
  &:hover ${DeliveryDate} {
    margin-right: ${({ shouldMoveDate }) => (shouldMoveDate ? '1.3rem' : '0')};
  }
  &:hover ${ActionButton} {
    opacity: 0.75;
  }
  color: ${({ theme }) => theme.core.textColor};
`

export const SpotTileWrapper = styled(TileWrapperBase)`
  position: relative;
  min-height: 11rem;
  height: 100%;
`

export const ReserveSpaceGrouping = styled.div``

export const SpotTileStyle = styled(TileBaseStyle)`
  background-color: ${({ theme }) => theme.core.lightBackground};
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: space-between;
  flex-direction: column;
  overflow: hidden;
  &:hover {
    background-color: ${({ theme }) =>
      theme.name === 'dark' ? theme.core.backgroundHoverColor : theme.core.lightBackground};
    box-shadow: ${({ theme }) =>
      theme.name === 'light' ? '0 0 10px 0 rgba(0, 0, 0, 0.1)' : 'none'};
  }
`
export const NotionalInputWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
`
