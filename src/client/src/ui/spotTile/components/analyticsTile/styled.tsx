import { styled } from 'rt-theme'

export const AnalyticsTileWrapper = styled.div`
  position: relative;
  min-height: 10rem;
  height: 100%;
  color: ${({ theme }) => theme.tile.textColor};
`
export const Header = styled.ul`
  display: flex;
  justify-content: space-between;
  list-style-type: none;
  margin-bottom: 5px;
`

export const HeaderItem = styled.li`
  color: ${({ theme }) => theme.textColor};
  font-size: 13px;
`
export const HeaderItemSmall = styled(HeaderItem)`
  font-size: 10px;
  opacity: 0.59;
`
export const AnalyticsTileContent = styled.div`
  display: flex;
`
export const GraphNotionalWrapper = styled.div`
  width: 70%;
  margin-right: 5px;
`

export const LineChartWrapper = styled.div`
  width: 100%;
  height: 80%;
`
