import React from 'react'
import { styled } from 'rt-theme'
import { PlatformAdapter, withPlatform } from 'rt-components'
import ExcelIcon from './assets/ExcelIcon'

const ExcelButton = styled('button')`
  opacity: 0.59;
  height: 100%;
  .svg-fill {
    fill: ${({ theme }) => theme.core.textColor};
  }
  .svg-stroke {
    stroke: ${({ theme }) => theme.core.textColor};
  }

  margin: 5px;

  .svg-size {
    height: 70%;
    width: 70%;
  }
`

const ExcelLauncher: React.FC<{ platform: PlatformAdapter }> = ({ platform }) =>
  platform.name === 'openfin' ? (
    <ExcelButton onClick={() => platform.interop!.excel!.open()}>
      <ExcelIcon />
    </ExcelButton>
  ) : null

export default withPlatform(ExcelLauncher)
