import React, { FunctionComponent } from 'react'
import { OpenFinChrome, OpenFinControls, PlatformAdapter, withPlatform } from 'rt-components'

import ShellRoute from './ShellRoute'

export const OpenFinRoute: FunctionComponent<{ platform: PlatformAdapter }> = ({ platform, ...props }) => (
  <OpenFinChrome>
    <ShellRoute
      header={
        <OpenFinControls
          minimize={platform.window.minimize!}
          maximize={platform.window.maximize!}
          close={platform.window.close!}
        />
      }
      {...props}
    />
  </OpenFinChrome>
)

export default withPlatform(OpenFinRoute)
