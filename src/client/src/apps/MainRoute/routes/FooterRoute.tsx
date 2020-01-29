import React from 'react'
import DefaultLayout from '../layouts/DefaultLayout'
import StatusBar from '../widgets/status-bar'
import StatusButton from '../widgets/status-connection'

interface Props {
  header?: React.ReactChild,
  footer?: React.ReactChild,
}

const FooterRoute: React.FC<Props> = ({ header, footer }) => {
  return (
    <DefaultLayout
      body={
        <StatusBar>
          {footer}
          <StatusButton/>
        </StatusBar>
      }
    />
  )
}

export default FooterRoute
