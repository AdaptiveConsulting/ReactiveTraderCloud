import React from 'react'

import { Dropdown, DropdownStyleProps } from 'rt-styleguide'
import { styled } from 'rt-theme'

export default (() => (
  <Root>
    <LabelColumn>
      <div />
      <label>Normal</label>
      <label>Hover</label>
      <label>Active</label>
      <label>Disabled</label>
    </LabelColumn>
    <DropdownColumn>
      <ColumnTitle>Primary</ColumnTitle>
      <DropdownVariants />
    </DropdownColumn>
  </Root>
)) as React.FC

const DropdownVariants: React.FC<DropdownStyleProps> = props => (
  <React.Fragment>
    {
      // standard
      <DropdownRow>
        <Dropdown {...props} title="Primary" />
      </DropdownRow>
    }
    {
      // standard
      <DropdownRow>
        <Dropdown {...props} title="Hover" active />
      </DropdownRow>
    }
    {
      // standard
      <DropdownRow>
        <Dropdown {...props} title="Active" active />
      </DropdownRow>
    }
    {
      // standard
      <DropdownRow>
        <Dropdown {...props} title="Disabled" disabled />
      </DropdownRow>
    }
  </React.Fragment>
)

const GridColumn = styled.div`
  display: grid;
  grid-template-rows: 3rem repeat(4, 2rem);
  grid-row-gap: 0.5rem;
  align-items: center;
`

const LabelColumn = styled(GridColumn)`
  font-size: 0.6875rem;
  color: ${({ theme }) => theme.secondary.base};
`

const ColumnTitle = styled.div``
const DropdownRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 0.5rem;
`
const DropdownColumn = styled(GridColumn)`
  min-width: 10rem;
`

const Root = styled.div`
  max-width: 60rem;

  display: grid;
  grid-template-columns: 5rem 1fr 1fr 1fr 1fr ;
  grid-column-gap: 2rem;

  padding-bottom: 2rem;

  ${DropdownColumn} + ${DropdownColumn} {
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
