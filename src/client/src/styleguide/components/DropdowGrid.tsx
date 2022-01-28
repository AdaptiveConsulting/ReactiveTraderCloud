import { FC } from "react"
import styled from "styled-components"
import { Dropdown } from "./Dropdown"

export default (() => (
  <Root>
    <LabelColumn>
      <div />
      <label>Primary</label>
      <label>Secondary</label>
    </LabelColumn>
    <DropdownColumn>
      <div>Normal</div>
      <Dropdown title="Action" />
      <Dropdown title="Action" />
    </DropdownColumn>
    <DropdownColumn>
      <div>Hover</div>
      <Dropdown title="Action" active />
      <Dropdown title="Action" active />
    </DropdownColumn>
    <DropdownColumn>
      <div>Active</div>
      <Dropdown title="Action" active />
      <Dropdown title="Action" active />
    </DropdownColumn>
    <DropdownColumn>
      <div>Disabled</div>
      <Dropdown title="Action" disabled />
      <Dropdown title="Action" disabled />
    </DropdownColumn>
  </Root>
)) as FC

const GridColumn = styled.div`
  display: grid;
  grid-template-rows: autp;
  grid-row-gap: 0.5rem;
  align-items: center;
  margin-bottom: 2rem;
`

const LabelColumn = styled(GridColumn)`
  font-size: 0.6875rem;
  color: ${({ theme }) => theme.secondary.base};
`

const DropdownColumn = styled(GridColumn)`
  min-width: 10rem;
`

const Root = styled.div`
  max-width: 60rem;

  display: grid;
  grid-template-columns: repeat(5, 100px);
  grid-column-gap: 2rem;

  ${DropdownColumn} + ${DropdownColumn} {
    position: relative;

    &::before {
      display: block;
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      box-shadow: 2rem 0 0 ${({ theme }) => theme.primary[1]};
      box-shadow: 2rem 0 0 black;
    }
  }
`
