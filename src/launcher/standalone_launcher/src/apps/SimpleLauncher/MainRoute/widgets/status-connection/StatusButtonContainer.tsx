import { connect } from 'react-redux'

import { GlobalState } from 'StoreTypes'
import { selectServices } from './selectors'
import { StatusButton } from './StatusButton'

const mapStateToProps = (state: GlobalState) => {
  return {
    connectionStatus: state.connectionStatus,
    services: selectServices(state),
  }
}

export default connect(mapStateToProps)(StatusButton)
