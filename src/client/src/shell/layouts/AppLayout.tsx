import React from 'react'
import { styled } from 'rt-theme'

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

        <Footer>{footer}</Footer>
        {after}
      </AppLayoutRoot>
    )
  }
}

const AppLayoutRoot = styled.div`
  width: 100%;
  max-width: 100%;
  height: 100%;
  min-height: 100vh;
  max-height: 100vh;
  overflow: hidden;

  display: grid;
  grid-template-rows: minmax(4rem, min-content) calc(100vh - 6rem) minmax(2rem, min-content);

  background-color: ${({ theme }) => theme.shell.backgroundColor};
  color: ${({ theme }) => theme.shell.textColor};

  justify-content: stretch;
  align-items: stretch;
`

const Body = styled.div`
  display: flex;

  background-color: ${({ theme }) => theme.shell.backgroundColor};
  color: ${({ theme }) => theme.shell.textColor};
`

const Footer = styled.div`
  position: relative;
`

export default AppLayout
