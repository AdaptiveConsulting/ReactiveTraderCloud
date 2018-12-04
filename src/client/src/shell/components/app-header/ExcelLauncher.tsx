import React from 'react'
import { PlatformAdapter, withPlatform } from 'rt-components'

const ExcelLauncher: React.SFC<{ platform: PlatformAdapter }> = ({ platform }) => (
  <React.Fragment>
    {platform.type === 'desktop' && <button onClick={() => platform.interop!.excel.open()}>Excel</button>}
  </React.Fragment>
)

export default withPlatform(ExcelLauncher)
