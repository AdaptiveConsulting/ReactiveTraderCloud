import { styled } from 'rt-theme'
import { TileWrapperBase, SpotTileStyle } from '../styled'
import { PlatformAdapter } from 'rt-components'

export const AnalyticsTileContent = styled.div`
  display: flex;
  height: 85%;
  justify-content: space-between;
`
export const GraphNotionalWrapper = styled.div`
  width: 58%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

export const LineChartWrapper = styled.div`
  width: 100%;
  height: 80%;
`

export const AnalyticsTileStyle = styled(SpotTileStyle)`
  background-color: #2f3542;
  &:hover {
    background-color: #3d4455;
  }
`
export const AnalyticsTileWrapper = styled(TileWrapperBase)<{ platform: PlatformAdapter }>`
  min-height: 11rem;
  height: ${({ platform: { name } }) =>
    name !== 'finsemble'
      ? '100%'
      : 'calc(100% - 25px)'}; // When loaded in Finsemble a 25px header is injected, this resets body to the correct height
  &:hover {
    background-color: #3d4455;
  }
`
