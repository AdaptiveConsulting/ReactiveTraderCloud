import styled from "styled-components"
import {
  SELLSIDE_RFQS_TABS,
  setQuotesFilter,
  useSellSideQuotesFilter,
} from "../sellSideState"

const HeaderWrapper = styled.header`
  padding: 4px;
  height: 40px;
  display: flex;
  justify-content: space-between;
  background: ${({ theme }) => theme.core.lightBackground};
`

const LeftNav = styled.div`
  display: flex;
  align-items: center;
`

export const NavItem = styled.li<{ active: boolean }>`
  font-size: 11px;
  list-style-type: none;
  margin-left: 15px;
  color: ${({ theme }) => theme.secondary.base};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  height: 32px;
  line-height: 32px;
  opacity: ${({ active }) => (active ? "1" : "0.52")};
  background: ${({ active, theme }) =>
    active ? theme.core.darkBackground : "none"};
  text-decoration: none;
  padding: 4px;
  min-width: 32px;
  min-height: 32px;
  text-align: center;
  border-radius: 2px;

  &:hover {
    cursor: pointer;
  }
`

const RightNav = styled.div`
  display: flex;
  font-size: 11px;
`

const TabsHeader = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.secondary.base};
`

export const SellSideGridHeader = () => {
  const rfqState = useSellSideQuotesFilter()

  return (
    <HeaderWrapper>
      <LeftNav>
        <TabsHeader>Queue</TabsHeader>
      </LeftNav>
      <RightNav>
        {SELLSIDE_RFQS_TABS.map((rfqStateOption) => (
          <NavItem
            key={rfqStateOption}
            active={rfqStateOption === rfqState}
            onClick={() => setQuotesFilter(rfqStateOption)}
          >
            {rfqStateOption}
          </NavItem>
        ))}
      </RightNav>
    </HeaderWrapper>
  )
}
