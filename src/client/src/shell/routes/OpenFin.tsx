import React from 'react'
import { OpenFinChrome, OpenFinControls } from 'rt-components'

import { OpenFinContext } from 'rt-components'
import Shell from './Shell'

export const OpenFin = ({ children }) => (
  <OpenFinContext.Consumer>
    {openFin => (
      <OpenFinChrome>
        <Shell
          header={<OpenFinControls minimize={openFin.minimize} maximize={openFin.maximize} close={openFin.close} />}
        />
      </OpenFinChrome>
    )}
  </OpenFinContext.Consumer>
)

export default OpenFin
