import { connect } from 'react-redux'
import { selectServices } from './selectors'
import { StatusButton } from './StatusButton'
import StatusDisplay from './StatusDisplay'
import { GlobalState } from 'StoreTypes'

export const mapStateToProps = (state: GlobalState) => {
  return {
    connectionStatus: state.connectionStatus,
    services: selectServices(state),
  }
}

const StatusButtonContainer = connect(mapStateToProps)(StatusButton)
const StatusDisplayContainer = connect(mapStateToProps)(StatusDisplay)

export { StatusButtonContainer, StatusDisplayContainer }