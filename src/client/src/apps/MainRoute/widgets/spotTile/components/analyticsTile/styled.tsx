import { styled } from 'rt-theme'
import { TileWrapperBase, SpotTileStyle } from '../styled'
import { Platform } from 'rt-platforms'

export const AnalyticsTileContent = styled.div`
  display: flex;
  height: 85%;
  justify-content: space-between;
`
export const GraphNotionalWrapper = styled.div`
  width: 44%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
export const PriceControlWrapper = styled.div`
  width: 50%;
  display: flex;
`
export const LineChartWrapper = styled.div`
  width: 100%;
  height: 80%;
`

export const AnalyticsTileStyle = styled(SpotTileStyle)`
  background-color: ${({ theme }) => theme.core.lightBackground};
  &:hover {
    background-color: ${({ theme }) => theme.core.backgroundHoverColor};
  }
`
export const AnalyticsTileWrapper = styled(TileWrapperBase)<{ platform: Platform }>`
  min-height: 11rem;
  height: ${({ platform: { name } }) =>
    name !== 'finsemble'
      ? '100%'
      : 'calc(100% - 25px)'}; // When loaded in Finsemble a 25px header is injected, this resets body to the correct height
  &:hover {
    background-color: ${({ theme }) => theme.core.backgroundHoverColor};
  }
`
