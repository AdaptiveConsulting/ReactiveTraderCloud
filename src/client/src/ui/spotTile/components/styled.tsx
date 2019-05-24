import { RouteStyle } from 'rt-components'
import { styled } from 'rt-theme'
import { TopRightButton } from './TileControls'
import { BottomRightButton } from './TileHeader'

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

  ${RouteStyle} & {
    border-radius: 0px;
  }
`

export const Icon = styled('i')`
  color: ${({ theme }) => theme.template.white.normal};
`

export const Button = styled('button')`
  border: none;
`

export const TileHeader = styled.div`
  display: flex;
  align-items: center;
`

export const TileWrapperBase = styled.div`
  position: relative;
  &:hover ${TopRightButton} {
    opacity: 0.75;
  }
  &:hover ${BottomRightButton} {
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
  justify-content: space-between;
  flex-direction: column;
  overflow: hidden;
`
export const NotionalInputWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
`
