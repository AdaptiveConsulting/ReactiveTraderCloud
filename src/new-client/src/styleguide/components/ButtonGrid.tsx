import { FC } from "react"
import { Button, ButtonStyleProps } from "./Button"
import styled from "styled-components"

interface TitleButtonProp {
  title?: string
}

export default (() => (
  <Root>
    <LabelColumn>
      <div />
      <label>Primary</label>
      <label>Secondary</label>
    </LabelColumn>
    <ButtonColumn>
      <ColumnTitle>Normal</ColumnTitle>
      <ButtonVariants />
    </ButtonColumn>
    <ButtonColumn>
      <ColumnTitle>Hover</ColumnTitle>
      <ButtonVariants active />
    </ButtonColumn>
    <ButtonColumn>
      <ColumnTitle>Active</ColumnTitle>
      <ButtonVariants active />
    </ButtonColumn>
    <ButtonColumn>
      <ColumnTitle>Disabled</ColumnTitle>
      <ButtonVariants disabled />
    </ButtonColumn>
  </Root>
)) as FC

const ButtonVariants: FC<ButtonStyleProps & TitleButtonProp> = (props) => (
  <>
    {
      // primary
      <ButtonRow>
        <Button {...props}>Action</Button>
      </ButtonRow>
    }
    {
      // secondary
      <ButtonRow>
        <Button intent="secondary" {...props}>
          Action
        </Button>
      </ButtonRow>
    }
  </>
)

const GridColumn = styled.div`
  display: grid;
  grid-template-rows: auto;
  grid-row-gap: 0.5rem;
  align-items: center;
  margin-bottom: 2rem;
`

const LabelColumn = styled(GridColumn)`
  font-size: 0.6875rem;
  color: ${({ theme }) => theme.secondary.base};
`

const ColumnTitle = styled.div``
const ButtonRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: 0.5rem;
`
const ButtonColumn = styled(GridColumn)`
  min-width: 10rem;
`

const Root = styled.div`
  max-width: 60rem;

  display: grid;
  grid-template-columns: repeat(5, 100px);
  grid-column-gap: 2rem;

  ${ButtonColumn} + ${ButtonColumn} {
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
