import React from 'react'
import { WorkspaceContainer } from '../widgets/workspace'
import ReconnectModal from '../components/reconnect-modal'
import DefaultLayout from '../layouts/DefaultLayout'
import { OverflowScroll, WorkspaceWrapper } from './styled'

interface Props {
  header?: React.ReactChild
}

const ShellRoute: React.FC<Props> = ({ header }) => {
  return (
    <DefaultLayout
      header={header}
      body={
        <WorkspaceWrapper>
          <OverflowScroll>
            <WorkspaceContainer />
          </OverflowScroll>
        </WorkspaceWrapper>
      }
      after={<ReconnectModal />}
    />
  )
}

export default ShellRoute
