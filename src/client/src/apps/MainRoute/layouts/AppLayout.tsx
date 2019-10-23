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

const AppLayout: React.FC<Props> = ({ before, header, body, footer, after }) => {
  return (
    <AppLayoutRoot data-qa="app-layout__root">
      {before}

      <Header>{header}</Header>

      <Body>{body}</Body>

      {footer}
      {after}
    </AppLayoutRoot>
  )
}

const AppLayoutRoot = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  max-height: 100vh;
  overflow: hidden;

  display: grid;
  grid-template-rows: auto 1fr auto;
  background-color: ${({ theme }) => theme.core.darkBackground};
  color: ${({ theme }) => theme.core.textColor};
`

const Body = styled.div`
  display: flex;
  overflow: hidden;
`

export default AppLayout
