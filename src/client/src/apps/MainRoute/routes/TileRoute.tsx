import React from 'react'
import { useSelector } from 'react-redux'
import { TearOff } from 'rt-components'
import { externalWindowDefault } from 'rt-platforms'
import { WorkspaceContainer } from '../widgets/workspace'
import ReconnectModal from '../components/reconnect-modal'
import DefaultLayout from '../layouts/DefaultLayout'
import { OverflowScroll, WorkspaceWrapper } from './styled'
import { addLayoutToConfig } from './addLayoutToConfig'
import { liveRatesSelector } from '../layouts'
import { inExternalWindow } from './inExternalWindow'

interface Props {
  header?: React.ReactChild
}

const ShellRoute: React.FC<Props> = ({ header }) => {
  const liveRates = useSelector(liveRatesSelector)
  return (
    <DefaultLayout
      header={header}
      body={
        <WorkspaceWrapper data-qa="tile-route__workspace-wrapper">
          <OverflowScroll>
            <TearOff
              id="liveRates"
              dragTearOff={false}
              externalWindowProps={addLayoutToConfig(externalWindowDefault.liveRatesRegion, liveRates)}
              render={(popOut, tornOff) => (
                <WorkspaceContainer 
                  onPopoutClick={popOut}                
                  tornOff={tornOff}
                  tearable={!inExternalWindow}
                />
              )}
              tornOff={!liveRates.visible}
            />
          </OverflowScroll>
        </WorkspaceWrapper>
      }
      after={<ReconnectModal />}
    />
  )
}

export default ShellRoute
