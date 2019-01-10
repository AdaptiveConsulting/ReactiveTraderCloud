import React from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine } from '@fortawesome/free-solid-svg-icons'
import { styled } from 'rt-theme'
import { Rect, IconWrapper } from './styled'

library.add(faChartLine)

const Wrapper = styled.div`
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

const AnalyticsViewIcon: React.SFC = () => (
  <IconWrapper>
    <ChartLineIconWrapper>
      <FontAwesomeIcon icon="chart-line" />
    </ChartLineIconWrapper>
    <Wrapper>
      <FirstRect />
      <Rect />
    </Wrapper>
  </IconWrapper>
)

export default AnalyticsViewIcon
