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

//TODO ML 26/02 move the color property to theme
export const AnalyticsTileStyle = styled(TileBaseStyle)`
  position: relative;
  background-color: #2f3542;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &:hover {
    background-color: #3d4455;
  }
`
