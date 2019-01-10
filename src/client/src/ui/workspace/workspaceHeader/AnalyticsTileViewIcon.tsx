import React from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine } from '@fortawesome/free-solid-svg-icons'
import { styled } from 'rt-theme'

library.add(faChartLine)

const Foo = styled.div`
  display: flex;
  justify-content: space-between;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Rect = styled.div`
  background-color: transparent;
  border: 1px solid white;
  width: 10px;
  height: 10px;
  margin-bottom: 2px;
`
//TODO I must remove this one here
export const HR = styled.hr`
  width: 80%;
  margin: 0 auto;
  height: 2px;
  background-color: black;
`

const ChartLineIconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const AnalyticsViewIcon: React.SFC = () => (
  <Foo>
    <ChartLineIconWrapper>
      <FontAwesomeIcon icon="chart-line" />
    </ChartLineIconWrapper>
    <Wrapper>
      <Rect />
      <Rect />
    </Wrapper>
  </Foo>
)

export default AnalyticsViewIcon
