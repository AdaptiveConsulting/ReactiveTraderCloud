import { styled } from 'rt-theme'
import { TileWrapperBase, SpotTileStyle } from '../styled'
import { Platform } from 'rt-platforms'

export const AnalyticsTileContent = styled.div`
  display: flex;
  height: 85%;
  justify-content: space-between;
`
export const GraphNotionalWrapper = styled.div<{isTimerOn: boolean}>`
  min-width: 0; //fixed bug with recharts resizing
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 2;
  max-height: ${({isTimerOn}) => (isTimerOn && '103px')};
`
export const PriceControlWrapper = styled.div`
  display: flex;
  width: 160px;
`
export const LineChartWrapper = styled.div<{ isTimerOn: boolean }>`
  width: 100%;
  height: ${({ isTimerOn }) => (isTimerOn ? '60%' : '80%')};
`

export const AnalyticsTileStyle = styled(SpotTileStyle)`
  background-color: ${({ theme }) => theme.core.lightBackground};
  &:hover {
    background-color: ${({ theme }) => theme.core.backgroundHoverColor};
  }
`
export const AnalyticsTileWrapper = styled(TileWrapperBase)<{ platform: Platform }>`
  min-height: 11rem;
  position: relative;
  height: ${({ platform: { name } }) =>
    name !== 'finsemble'
      ? '100%'
      : 'calc(100% - 25px)'}; // When loaded in Finsemble a 25px header is injected, this resets body to the correct height
  &:hover {
    background-color: ${({ theme }) => theme.core.backgroundHoverColor};
  }
`
