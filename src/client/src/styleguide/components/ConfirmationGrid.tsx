import { FC } from "react"
import styled from "styled-components"

export default (() => (
  <Root>
    <LabelColumn>
      <div>Confirmations</div>
      <label>Executed</label>
      <label>Rejected</label>
    </LabelColumn>
    <ConfirmationColumn>
      <ConfirmationRow />
      <ConfirmationRow>
        <ConfirmationBlock />
      </ConfirmationRow>
      <ConfirmationRow>
        <ConfirmationBlock rejected />
      </ConfirmationRow>
    </ConfirmationColumn>
  </Root>
)) as FC

const ConfirmationBlock = styled.div<{ rejected?: boolean }>`
  display: grid;
  grid-template-rows: 2rem repeat(2, 1fr);
  grid-row-gap: 0.5rem;
  align-items: center;
  width: 100%;
  min-height: 60px;
  border-radius: 3px;
  background-color: ${({ theme, rejected }) =>
    rejected ? theme.accents.negative.base : theme.accents.positive.base};
`

const GridColumn = styled.div`
  display: grid;
  grid-template-rows: 2rem repeat(2, 1fr);
  grid-row-gap: 0.5rem;
  align-items: center;
`

const LabelColumn = styled(GridColumn)`
  font-size: 0.6875rem;
  color: ${({ theme }) => theme.secondary[1]};

  & > div {
    font-size: 0.875rem;
  }
`

const ConfirmationColumn = styled(GridColumn)`
  min-width: 10rem;
`

const ConfirmationRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: 0.5rem;
`

const Root = styled.div`
  max-width: 60rem;

  display: grid;
  grid-template-columns: minmax(auto, 80px) 1fr;
  grid-column-gap: 2rem;
  padding-bottom: 2rem;

  ${ConfirmationColumn} + ${ConfirmationColumn} {
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
