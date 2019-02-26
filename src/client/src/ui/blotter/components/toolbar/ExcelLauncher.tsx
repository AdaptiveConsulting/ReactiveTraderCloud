import React, { FC } from 'react';
import { usePlatform } from 'rt-components';
import { styled } from 'rt-theme';
import ExcelIcon from './assets/ExcelIcon';

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

const ExcelLauncher: FC = () => {
  const platform  = usePlatform()
  return platform.name === 'openfin' ? (
    <ExcelButton onClick={() => platform.interop!.excel!.open()}>
      <ExcelIcon />
    </ExcelButton>
  ) : null 
}

export default ExcelLauncher
