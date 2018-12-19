import React from 'react'
import { styled } from 'rt-theme'

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: space-between;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px;
`
const LeftNav = styled.div`
  display: flex;
  justify-content: space-between;
`

const RightNav = styled.div``

interface WorkspaceHeaderProps {
  children: JSX.Element
}
class WorkspaceHeader extends React.Component<WorkspaceHeaderProps, {}> {
  render() {
    return (
      <HeaderWrapper>
        <Header>
          <LeftNav>
            <div>Live Rates</div>
            <div>All</div>
            <div>USD</div>
            <div>EUR</div>
            <div>GBP</div>
          </LeftNav>
          <RightNav>Right Stuff</RightNav>
        </Header>
        {this.props.children}
      </HeaderWrapper>
    )
  }
}

export default WorkspaceHeader
