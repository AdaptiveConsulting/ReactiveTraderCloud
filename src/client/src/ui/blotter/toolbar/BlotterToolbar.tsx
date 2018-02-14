import * as React from 'react'
import './blotterToolbar.scss'
import QuickFilter from './QuickFilter'

interface BlotterToolbarProps {
  toggleTheme: () => void
  isQuickFilterApplied: boolean
  removeQuickFilter: () => void
  quickFilterChangeHandler: (event:React.FormEvent<any>) => void
}

interface BlotterToobarState {
  themeName: string
}

export default class BlotterToolbar extends React.Component<BlotterToolbarProps, BlotterToobarState> {

  render() {
    return (
      <div className="blotter-toolbar">
        <div className="blotter-toolbar__theme-switch" onClick={this.props.toggleTheme}>Switch theme</div>
        <div className="blotter-toolbar__right-controls">
        <QuickFilter isFilterApplied={this.props.isQuickFilterApplied}
                     removeQuickFilter={this.props.removeQuickFilter}
                     quickFilterChangeHandler={this.props.quickFilterChangeHandler}/>
        </div>
      </div>
    )
  }
}
