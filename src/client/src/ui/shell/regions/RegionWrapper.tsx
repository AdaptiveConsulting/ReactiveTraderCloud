import React from 'react'
import { connect } from 'react-redux'
import { GlobalState } from '../../../combineReducers'
import { RegionsState } from './reducer'

interface RegionProps {
  region: string
  service: RegionsState
  children?: any
}

export const RegionWrapper: React.SFC<RegionProps> = ({ region, children, service }: RegionProps) =>
  (displayChildComponent(service, region) && children) || null

const displayChildComponent = (service: RegionsState, region: string) => {
  let displayChild = true

  if (service && region && service[region]) {
    displayChild = !service[region].isTearedOff
  }

  return displayChild
}

const mapStateToProps = ({ regionsService: service }: GlobalState) => ({ service })

export default connect(mapStateToProps)(RegionWrapper)
