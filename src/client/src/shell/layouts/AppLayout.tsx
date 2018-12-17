import React from 'react'
import { styled } from 'test-theme'

import Header from '../components/app-header'

export interface Props {
  before?: React.ReactNode
  header?: React.ReactNode
  body: React.ReactNode
  footer?: React.ReactNode
  after?: React.ReactNode
}

class AppLayout extends React.Component<Props> {
  render() {
    const { before, header, body, footer, after } = this.props

    return (
      <AppLayoutRoot>
        {before}

        <Header>{header}</Header>

        <Body>{body}</Body>

        {footer}
        {after}
      </AppLayoutRoot>
    )
  }
}

const AppLayoutRoot = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  max-height: 100vh;
  overflow: hidden;

  display: grid;
  grid-template-rows: auto 1fr auto;
  background-color: ${({ theme }) => theme.shell.backgroundColor};
  color: ${({ theme }) => theme.shell.textColor};
`

const Body = styled.div`
  display: flex;
  overflow: hidden;
`

export default AppLayout
