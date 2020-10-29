import React from 'react'
import { useSelector } from 'react-redux'
import { AnalyticsContainer } from '../widgets/analytics'
import styled from 'styled-components/macro'
import { externalWindowDefault } from 'rt-platforms'
import { TearOff } from 'rt-components'
import { analyticsSelector } from '../layouts'
import { addLayoutToConfig } from './addLayoutToConfig'
import { inExternalWindow as isExternalWindow } from './inExternalWindow'

const AnalyticsRouteStyle = styled.div<{ useHeightOffset  : boolean }>`
  /*height offset is needed for openfin controls*/
  height: ${({ useHeightOffset  }) => (useHeightOffset  ? 'calc(100% - 24px)' : '100%')};
  padding: 0.5rem 0.625rem 0.25rem 0.625rem;
  overflow-x: auto;
  margin: auto;
`
const AnalyticsRoute = () => {
  const analytics = useSelector(analyticsSelector)

  return (
    <TearOff
      id="Analytics"
      dragTearOff={false}
      externalWindowProps={addLayoutToConfig(externalWindowDefault.analyticsRegion, analytics)}
      render={(popOut, tornOff) => (
        <AnalyticsRouteStyle useHeightOffset={tornOff}>
          <AnalyticsContainer
            inExternalWindow={isExternalWindow}
            onPopoutClick={popOut}
            tornOff={tornOff}
            tearable={!isExternalWindow}
          />
        </AnalyticsRouteStyle>
      )}
      tornOff={!analytics.visible}
    />
  )
}

export default AnalyticsRoute
