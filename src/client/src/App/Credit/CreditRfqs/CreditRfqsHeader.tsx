import { DropdownMenu } from "@/components/DropdownMenu"
import { RfqState } from "@/generated/TradingGateway"
import { removeRfqs, useExecutedRfqIds } from "@/services/credit"
import styled from "styled-components"
import { ClearRfqsIcon } from "./ClearRfqsIcon"
import {
  ALL_RFQ_STATES,
  onSelectRfqState,
  useSelectedRfqState,
} from "./selectedRfqState"

const HeaderWrapper = styled.header`
  padding: 1em 8px 1em 6px;
  display: flex;
  justify-content: space-between;
`

const LeftNav = styled.div`
  display: flex;
  align-items: center;
`

export const NavItem = styled.li<{ active: boolean }>`
  font-size: 14px;
  list-style-type: none;
  margin-left: 15px;
  color: ${({ theme }) => theme.secondary.base};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  height: 34px;
  line-height: 34px;
  opacity: ${({ active }) => (active ? "1" : "0.52")};
  background: ${({ active, theme }) =>
    active ? theme.core.lightBackground : "none"};
  text-decoration: none;
  padding: 5px;
  min-width: 34px;
  min-height: 34px;
  text-align: center;
  border-radius: 2px;

  &:hover {
    cursor: pointer;
  }

  @media (max-width: 915px) {
    display: none;
  }
`

const RightNav = styled.div`
  display: flex;
`

const RfqStateDropdown = styled.div`
  display: none;
  @media (max-width: 915px) {
    display: block;
  }
`

const ClearRfqsButton = styled.button<{ disabled: boolean }>`
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.core.lightBackground};
  ${({ disabled }) => (disabled ? "opacity: 0.3" : "")}
`

const getRfqStateText = (rfqState: string) => {
  switch (rfqState) {
    case RfqState.Open:
      return "Live"
    case RfqState.Closed:
      return "Done"
    case RfqState.Cancelled:
      return "Canceled"
    default:
      return rfqState
  }
}

export const CreditRfqsHeader: React.FC = () => {
  const rfqState = useSelectedRfqState()
  const options = [ALL_RFQ_STATES, ...Object.values(RfqState)]
  const executedRfqIds = useExecutedRfqIds()

  return (
    <HeaderWrapper>
      <LeftNav>
        <div>RFQ's</div>
        {options.map((rfqStateOption) => (
          <NavItem
            key={rfqStateOption}
            active={rfqStateOption === rfqState}
            onClick={() => onSelectRfqState(rfqStateOption)}
          >
            {getRfqStateText(rfqStateOption)}
          </NavItem>
        ))}
      </LeftNav>
      <RightNav>
        <RfqStateDropdown>
          <DropdownMenu
            selectedOption={rfqState}
            options={options}
            onSelectionChange={onSelectRfqState}
          />
        </RfqStateDropdown>
        <ClearRfqsButton
          onClick={() => removeRfqs(executedRfqIds)}
          disabled={executedRfqIds.length === 0}
        >
          {ClearRfqsIcon}
        </ClearRfqsButton>
      </RightNav>
    </HeaderWrapper>
  )
}
