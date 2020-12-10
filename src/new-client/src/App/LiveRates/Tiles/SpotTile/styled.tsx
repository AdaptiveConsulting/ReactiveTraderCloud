import styled from 'styled-components/macro'
import { TileBaseStyle, TileWrapperBase } from '../styled'

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
