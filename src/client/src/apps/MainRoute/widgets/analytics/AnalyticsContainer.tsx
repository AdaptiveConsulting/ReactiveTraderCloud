import React from 'react'
import { Loadable } from 'rt-components'
import { usePlatform } from 'rt-platforms'
import { useAnalyticsConnection, useHistory, usePositions, useRefData } from './analyticsHooks'
import Analytics from './components'

interface AnalyticsContainerOwnProps {
  onPopoutClick?: () => void
  tornOff?: boolean
  tearable?: boolean
  inExternalWindow?: boolean
}

type AnalyticsContainerProps = AnalyticsContainerOwnProps

export const AnalyticsContainer: React.FC<AnalyticsContainerProps> = ({
  tearable = false,
  tornOff,
  inExternalWindow = false,
}) => {
  const history = useHistory()
  const positions = usePositions()
  const status = useAnalyticsConnection()
  const pairs = useRefData()

  const { allowTearOff } = usePlatform()
  return (
    <Loadable
      minWidth={22}
      status={status}
      render={() => (
        <Analytics
          currencyPairs={pairs}
          positionsChartModel={positions}
          analyticsLineChartModel={history}
          inExternalWindow={inExternalWindow}
          canPopout={tearable && allowTearOff && !tornOff}
        />
      )}
      message="Analytics Disconnected"
    />
  )
}
