import * as React from 'react'
import { Provider } from 'react-redux'

export interface PopoutRootProps {
  store: any
  content: JSX.Element
}

// The root component for the popout. It attaches the store and material UI theme etc.
// so that they can be used by components in the new tree.
export default class PopoutRoot extends React.Component<PopoutRootProps, {}> {
  render() {

    console.log(' **** popoutRoot called render, this.props.store, this.props.content', this.props.store, this.props.content)
    return (
      <Provider store={this.props.store}>
        <div>
          <div >
            {this.props.content}
          </div>
        </div>
      </Provider>
    )
  }
}
