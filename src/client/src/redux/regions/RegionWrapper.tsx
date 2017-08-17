import * as React from 'react'
import {connect} from 'react-redux'
import './region.scss'
class RegionWrapper extends React.Component<any, any> {

  public render() {
    const {region, children, service} = this.props
    let displayChildComponent = true

    if (service && region && service[region]) {
      displayChildComponent = !service[region].isTearedOff
    }

    const wrapperClassName = `region-wrapper ${!displayChildComponent ? 'region-wrapper--hidden' : ''}`
    return (
      <div className={wrapperClassName}>
        { displayChildComponent ? children: '' }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    service: state.regionsService
  }
}

export default connect(mapStateToProps)(RegionWrapper)
