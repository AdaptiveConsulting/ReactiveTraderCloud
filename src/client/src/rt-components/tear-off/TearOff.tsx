import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { RegionActions } from 'rt-actions'
import { styled } from 'rt-theme'
import Portal, { PortalProps } from './Portal'

export const TearOffContainer = styled.div`
  width: 100%;
  height: 100%;
`

type RenderCB = (popOut: () => void, tornOff: boolean) => JSX.Element

type TearOffDispatchProps = ReturnType<typeof mapDispatchToProps>
type TearOffProps = TearOffDispatchProps & {
  id: string
  render: RenderCB
  portalProps: Partial<PortalProps>
}

class TearOff extends React.PureComponent<TearOffProps, { tornOff: boolean }> {
  state = { tornOff: false }

  componentDidMount() {
    const { id, onMount } = this.props
    onMount({ id })
  }

  popOut = (region: string) => {
    this.setState({ tornOff: true }, () => this.props.onPopOut({ id: region }))
  }

  popIn = (region: string) => {
    this.setState({ tornOff: false }, () => this.props.onPopIn({ id: region }))
  }

  render() {
    const { render, portalProps, id } = this.props
    const { tornOff } = this.state
    if (tornOff) {
      return (
        <Portal onUnload={() => this.popIn(id)} {...portalProps}>
          <TearOffContainer>{render(() => this.popOut(id), tornOff)}</TearOffContainer>
        </Portal>
      )
    }
    return render(() => this.popOut(id), tornOff)
  }
}

interface Region {
  id: string
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onPopOut: (region: Region) => dispatch(RegionActions.popoutOpened(region)),
  onPopIn: (region: Region) => dispatch(RegionActions.popoutClosed(region)),
  onMount: (region: Region) => dispatch(RegionActions.addRegion(region))
})

export const TearOffConnected = connect(
  null,
  mapDispatchToProps
)(TearOff)
