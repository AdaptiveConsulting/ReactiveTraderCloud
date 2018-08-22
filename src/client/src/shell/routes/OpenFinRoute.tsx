import React from 'react'
import { OpenFinChrome, OpenFinControls } from 'rt-components'

import { Environment } from 'rt-components'
import ShellRoute from './ShellRoute'

export const OpenFinRoute = props => (
  <Environment.Consumer>
    {({ openfin }) => (
      <OpenFinChrome>
        <ShellRoute
          header={<OpenFinControls minimize={openfin.minimize} maximize={openfin.maximize} close={openfin.close} />}
          {...props}
        />
      </OpenFinChrome>
    )}
  </Environment.Consumer>
)

export default OpenFinRoute
