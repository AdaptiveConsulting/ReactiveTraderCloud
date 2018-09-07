import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Loadable } from 'rt-components'
import { Environment } from 'rt-system'
import { GlobalState } from 'StoreTypes'
import { BlotterActions } from './actions'
import Blotter from './components'
import { selectBlotterRows, selectBlotterStatus } from './selectors'

interface BlotterContainerOwnProps {
  onPopoutClick: () => void
  tornOff: boolean
}

type BlotterContainerStateProps = ReturnType<typeof mapStateToProps>
type BlotterContainerDispatchProps = ReturnType<typeof mapDispatchToProps>
type BlotterContainerProps = BlotterContainerStateProps & BlotterContainerDispatchProps & BlotterContainerOwnProps

class BlotterContainer extends React.Component<BlotterContainerProps> {
  componentDidMount() {
    this.props.subscribeToBlotter()
  }

  render() {
    const { rows, status, tornOff, onPopoutClick } = this.props
    return (
      <Loadable
        status={status}
        render={() => (
          <Blotter rows={rows} onPopoutClick={onPopoutClick} canPopout={!Environment.isRunningInIE() && !tornOff} />
        )}
      />
    )
  }
}

const mapStateToProps = (state: GlobalState) => ({
  rows: selectBlotterRows(state),
  status: selectBlotterStatus(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  subscribeToBlotter: () => dispatch(BlotterActions.subscribeToBlotterAction())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BlotterContainer)
