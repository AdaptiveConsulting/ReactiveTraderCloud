import React from 'react'
import Helmet from 'react-helmet'
import { styled } from 'rt-theme'

import Header from '../components/app-header'

export interface Props {
  before?: React.ReactNode
  header?: React.ReactNode
  body: React.ReactNode
  footer?: React.ReactNode
  after?: React.ReactNode
}

const scrollbarCSS = `
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background-color: rgba(212, 221, 232, .4);
  }
  ::-webkit-scrollbar-corner {
    background-color: rgba(0,0,0,0);
  }
`

class AppLayout extends React.Component<Props> {
  render() {
    const { before, header, body, footer, after } = this.props

    return (
      <AppLayoutRoot>
        <Helmet>
          <style>{scrollbarCSS}</style>
        </Helmet>

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
