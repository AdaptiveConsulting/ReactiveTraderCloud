import React, { FC } from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine } from '@fortawesome/free-solid-svg-icons'
import { styled } from 'rt-theme'
import { Rect, IconWrapper } from './styled'

library.add(faChartLine)

const RectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const FirstRect = styled(Rect)`
  margin-bottom: 2px;
`
const ChartLineIconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const AnalyticsViewIcon: FC = () => (
  <IconWrapper>
    <ChartLineIconWrapper>
      <FontAwesomeIcon icon="chart-line" />
    </ChartLineIconWrapper>
    <RectWrapper>
      <FirstRect />
      <Rect />
    </RectWrapper>
  </IconWrapper>
)

export default AnalyticsViewIcon
