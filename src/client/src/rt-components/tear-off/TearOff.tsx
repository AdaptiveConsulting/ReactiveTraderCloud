import React from 'react'
import ExternalWindow, { ExternalWindowProps } from './ExternalWindow'
import { Dispatch } from 'redux'
import { LayoutActions } from '../../shell/layouts/layoutActions'
import { connect } from 'react-redux'

type RenderCB = (popOut: () => void, tornOff: boolean) => JSX.Element

export interface TearOffProps {
  id: string
  render: RenderCB
  externalWindowProps: Partial<ExternalWindowProps>
  tornOff: boolean
}

interface TearOffDispatchProps {
  onPopIn: (name: string) => void
  onPopOut: (name: string) => void
}

type TearOffContainerProps = TearOffProps & TearOffDispatchProps

class TearOff extends React.PureComponent<TearOffContainerProps> {
  render() {
    const { render, externalWindowProps, tornOff, onPopIn, onPopOut } = this.props
    const windowName = externalWindowProps.config.name
    const popOut = () => onPopOut(windowName)
    const popIn = () => onPopIn(windowName)

    if (tornOff) {
      return <ExternalWindow onUnload={popIn} {...externalWindowProps} />
    }
    return render(popOut, tornOff)
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onPopOut: (name: string) =>
    dispatch(LayoutActions.updateContainerVisibilityAction({ name, display: false })),
  onPopIn: (name: string) =>
    dispatch(LayoutActions.updateContainerVisibilityAction({ name, display: true })),
})

export default connect(
  null,
  mapDispatchToProps,
)(TearOff)
