import React from 'react'
import { Loadable } from 'rt-components'
import { usePlatform } from 'rt-platforms'
import { BlotterFilters, filterBlotterTrades } from './blotterTradesFilter'
import Blotter from './components'
import { useBlotter, useBlotterConnection } from './blotterHooks'

interface BlotterContainerOwnProps {
  filters?: BlotterFilters
  onPopoutClick?: () => void
  tornOff?: boolean
  tearable?: boolean
}
type BlotterContainerProps = BlotterContainerOwnProps

const BlotterContainer: React.FC<BlotterContainerProps> = ({
  tearable = false,
  tornOff,
  filters,
  onPopoutClick,
}) => {
  const rows = useBlotter()
  const status = useBlotterConnection()
  console.log('render')
  const filtered = filters ? filterBlotterTrades(rows, filters) : rows

  const { allowTearOff } = usePlatform()

  return (
    <Loadable
      status={status}
      render={() => (
        <Blotter
          rows={filtered}
          onPopoutClick={onPopoutClick}
          canPopout={tearable && allowTearOff && !tornOff}
        />
      )}
      message="Blotter Disconnected"
    />
  )
}

export default BlotterContainer
