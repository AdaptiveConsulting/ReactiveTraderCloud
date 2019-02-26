import { styled } from 'rt-theme'
import { TileBaseStyle } from '../styled'

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

export const AnalyticsTileStyle = styled(TileBaseStyle)`
  background-color: ${({ theme }) => theme.tile.inputColor};
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
