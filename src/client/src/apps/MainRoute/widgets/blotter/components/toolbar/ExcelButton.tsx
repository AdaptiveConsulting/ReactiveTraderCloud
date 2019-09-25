import React, { FC } from 'react'
import { styled } from 'rt-theme'
import ExcelIcon from './assets/ExcelIcon'

const Button = styled('button')`
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
    transform: scale(0.7);
  }
`

interface Props {
  onClick: () => void
}

const ExcelButton: FC<Props> = ({ onClick }) => (
  <Button onClick={onClick} data-qa="excel-button__button">
    <ExcelIcon />
  </Button>
)

export default ExcelButton
