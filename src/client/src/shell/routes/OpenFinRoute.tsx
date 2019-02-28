import React, { FC } from 'react'
import { OpenFinChrome, OpenFinControls, usePlatform } from 'rt-components'

import ShellRoute from './ShellRoute'

export const OpenFinRoute: FC = ({ ...props }) => {
  const platform = usePlatform()

  return (
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
}

export default OpenFinRoute
