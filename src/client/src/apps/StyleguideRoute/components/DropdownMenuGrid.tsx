import React from 'react'

import { DropdownMenu, DropdownMenuStyleProps } from 'rt-styleguide'
import { styled } from 'rt-theme'

const options = ['option 2', 'option 3', 'option 4']

export default (() => (
  <Root>
    <LabelColumn>
      <div />
      <div />
    </LabelColumn>
    <DropdownMenuColumn>
      <ColumnTitle>Normal</ColumnTitle>
      <DropdownMenuVariants options={options} />
    </DropdownMenuColumn>
    <DropdownMenuColumn>
      <ColumnTitle>Hover</ColumnTitle>
      <DropdownMenuVariants options={options} hover />
    </DropdownMenuColumn>
    <DropdownMenuColumn>
      <ColumnTitle>Active/Selected</ColumnTitle>
      <DropdownMenuVariants options={options} active />
    </DropdownMenuColumn>
    <DropdownMenuColumn>
      <ColumnTitle>Disabled</ColumnTitle>
      <DropdownMenuVariants options={options} disabled />
    </DropdownMenuColumn>
  </Root>
)) as React.FC

const DropdownMenuVariants: React.FC<DropdownMenuStyleProps> = props => (
  <React.Fragment>
    {
      // standard
      <DropdownMenuRow>
        <DropdownMenu {...props} />
      </DropdownMenuRow>
    }
  </React.Fragment>
)

const GridColumn = styled.div`
  display: grid;
  grid-template-rows: 3rem 1fr;
  grid-row-gap: 0.5rem;
  align-items: center;
`

const LabelColumn = styled(GridColumn)`
  font-size: 0.6875rem;
  color: ${({ theme }) => theme.secondary.base};
`

const ColumnTitle = styled.div``
const DropdownMenuRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 0.5rem;
`
const DropdownMenuColumn = styled(GridColumn)`
  min-width: 10rem;
`

const Root = styled.div`
  max-width: 60rem;

  display: grid;
  grid-template-columns: 5rem 1fr 1fr 1fr 1fr 1fr 1fr ;
  grid-column-gap: 2rem;

  padding-bottom: 2rem;

  ${DropdownMenuColumn} + ${DropdownMenuColumn} {
    position: relative;

    &::before {
      display: block;
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      box-shadow: 2rem 0 0 ${({ theme }) => theme.primary[1]};
      box-shadow: 2rem 0 0 black;
    }
  }
`
