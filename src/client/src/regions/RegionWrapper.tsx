import * as React from 'react'
import { connect } from 'react-redux'
class RegionWrapper extends React.Component<any, any> {

  public render() {
    const { region, children, service } = this.props
    let displayChildComponent = true

    if (service && region && service[region]) {
      displayChildComponent = !service[region].isTearedOff
    }

    return ( displayChildComponent ? children : null )
  }
}

const mapStateToProps = (state) => ({service: state.regionsService})

export default connect(mapStateToProps)(RegionWrapper)
