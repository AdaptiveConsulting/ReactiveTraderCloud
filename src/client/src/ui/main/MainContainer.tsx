import * as React from 'react'
import { connect } from 'react-redux'

import { WorkspaceContainer } from './../workspace'
import { BlotterContainer } from './../blotter'
import { AnalyticsContainer } from './../analytics'

import './main.scss'
import '../common/styles/_base.scss'
import '../common/styles/_fonts.scss'

class MainContainer extends React.Component<any, {}> {

  public render() {
    // @todo: implement the loading splash screen
    return (
      <div>
        <div className="shell__container">
          <div className="shell_workspace_blotter">
            <WorkspaceContainer />
            <BlotterContainer />
          </div>
          <div className="shell__sidebar">
            <AnalyticsContainer />
          </div>
        </div>
        <div className="shell__footer">
          Footer
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: any): object => {
  return { isLoaded: state.isLoaded }
}

export default connect(mapStateToProps)(MainContainer)
