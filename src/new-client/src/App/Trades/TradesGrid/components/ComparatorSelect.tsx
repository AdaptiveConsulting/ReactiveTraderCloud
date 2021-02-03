import { DateFilterContent } from "App/Trades/TradesState/filterState/dateFilterState"
import React, { useRef } from "react"
import styled from "styled-components/macro"
import { usePopUpMenu } from "utils"
import type { NumFilterContent } from "../../TradesState"
import { ComparatorType } from "../../TradesState"

export const ComparatorSelectOuter = styled.div`
  display: block;
  position: relative;
  width: 10rem;
  background-color: ${({ theme }) => theme.core.lightBackground};
  border-radius: 4px;
  color: ${({ theme }) => theme.core.textColor};
  font-size: 12px;
  outline: none;
  padding: 8px 15px 5px 15px;
  cursor: pointer;
  transition: all 200ms ease;
  text-transform: none;
  text-align: left;
`

export const ComparatorSelectInner = styled.div<{ visible: boolean }>`
  border-radius: 4px;
  display: ${({ visible }) => (visible ? "block" : "none")};
  position: absolute;
  top: 40px;
  left: 0px;
  background-color: ${({ theme }) => theme.primary.base};
  padding: 6px;
  box-shadow: 0 7px 26px 0 rgba(23, 24, 25, 0.5);
  z-index: 100;
  width: 100%;
`

export const ComparatorOption = styled.div`
  padding: 8px 8px 5px 8px;
  font-weight: normal;
  background-color: inherit;
  border-radius: 2px;
  margin-bottom: 5px;

  &:hover {
    background-color: ${({ theme }) => theme.core.backgroundHoverColor};
    font-weight: normal;
    text-decoration: underline;
  }
`

export const ComparatorSelect: React.FC<{
  selected: DateFilterContent | NumFilterContent
  onSelection: (comparator: ComparatorType) => void
}> = ({ selected, onSelection }) => {
  const innerRef = useRef<HTMLDivElement>(null)
  const { displayMenu, setDisplayMenu } = usePopUpMenu(innerRef)
  const toggle = () => setDisplayMenu(!displayMenu)
  return (
    <ComparatorSelectOuter>
      <div
        onClick={() => {
          toggle()
        }}
      >
        {selected.comparator}
      </div>
      <ComparatorSelectInner visible={displayMenu} ref={innerRef}>
        {Object.values(ComparatorType).map((comparator) => (
          <ComparatorOption
            key={comparator}
            onClick={() => {
              onSelection(comparator)
              setDisplayMenu(false)
            }}
          >
            {comparator}
          </ComparatorOption>
        ))}
      </ComparatorSelectInner>
    </ComparatorSelectOuter>
  )
}
