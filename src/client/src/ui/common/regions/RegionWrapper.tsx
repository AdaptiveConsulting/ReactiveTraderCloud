import * as React from 'react'
import { connect } from 'react-redux'
import { GlobalState } from '../../../combineReducers'

interface OwnProps {
  region: string
}

const mapStateToProps = (state: GlobalState) => ({ service: state.regionsService })

type StateProps = ReturnType<typeof mapStateToProps>

class RegionWrapper extends React.Component<OwnProps & StateProps> {
  public render() {
    const { region, children, service } = this.props
    let displayChildComponent = true

    if (service && region && service[region]) {
      displayChildComponent = !service[region].isTearedOff
    }

    return displayChildComponent ? children : null
  }
}

export default connect(mapStateToProps)(RegionWrapper)
