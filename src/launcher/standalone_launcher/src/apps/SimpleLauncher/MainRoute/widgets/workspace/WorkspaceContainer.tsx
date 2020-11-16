import React from 'react'
import { connect } from 'react-redux'
import { Loadable } from 'rt-components'
import { usePlatform } from 'rt-platforms'
import { GlobalState } from 'StoreTypes'
import { selectExecutionStatus, selectSpotTiles, selectSpotCurrencies } from './selectors'
import Workspace from './Workspace'

interface WorkspaceContainerOwnProps {
  onPopoutClick?: () => void
  tornOff?: boolean
  tearable?: boolean
}

const mapStateToProps = (state: GlobalState) => ({
  spotTiles: selectSpotTiles(state),
  status: selectExecutionStatus(state),
  currencyOptions: selectSpotCurrencies(state),
})

type Props = ReturnType<typeof mapStateToProps> & WorkspaceContainerOwnProps

const WorkspaceContainer: React.FC<Props> = props => {
  const { status, tearable = false, tornOff, onPopoutClick } = props
  const { allowTearOff } = usePlatform()

  return (
    <Loadable
      status={status}
      render={() => (
        <Workspace
          {...props}
          canPopout={allowTearOff && tearable && !tornOff}
          onPopoutClick={onPopoutClick}
        />
      )}
      message="Pricing Disconnected"
    />
  )
}

export default connect(mapStateToProps)(WorkspaceContainer)
