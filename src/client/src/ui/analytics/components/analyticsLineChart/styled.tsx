import { styled } from 'rt-theme'

export const AnalyticsLineChartStyle = styled.div`
  width: 100%;
  height: 100%;
  .recharts-cartesian-axis-ticks {
    color: #ffffff;
    width: 52px;
    height: 12px;
    opacity: 1;
    font-size: 10px;
  }
`

export const ToolTipStyle = styled.div`
  background-color: #14161c;
  width: 120px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const ToolTipChildLeft = styled.div`
  width: 70px;
  opacity: 0.6;
  font-size: 10px;
`
export const ToolTipChildRight = styled.div`
  width: 30px;
  font-size: 10px;
`
