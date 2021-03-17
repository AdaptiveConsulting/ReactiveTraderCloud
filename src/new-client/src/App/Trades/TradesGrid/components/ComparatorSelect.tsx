import { useRef } from "react"
import styled from "styled-components"
import { usePopUpMenu } from "@/utils"
import type { NumFilterContent } from "../../TradesState"
import { DateFilterContent } from "../../TradesState/filterState/dateFilterState"
import { ComparatorType } from "../../TradesState"
import { colors } from "@/theme"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"

export const ComparatorSelectOuter = styled.div`
  display: block;
  position: relative;
  width: 10rem;
  background-color: ${({ theme }) => theme.core.lightBackground};
  color: ${({ theme }) => theme.core.textColor};
  font-size: 12px;
  outline: none;
  padding: 8px 15px 5px 15px;
  cursor: pointer;
  transition: all 200ms ease;
  text-transform: none;
  text-align: left;
  border-bottom: 1px solid ${colors.spectrum.blue.base};
`

const ComparatorSelectInner = styled.div<{ visible: boolean }>`
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

const ComparatorOption = styled.div`
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

const ComparatorSelected = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position relative;
`

const AlignedUp = styled(FaChevronUp)`
  position: relative;
  top: 2px;
`
const AlignedDown = styled(FaChevronDown)`
  position: relative;
  top: 2px;
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
      <ComparatorSelected
        onClick={(e) => {
          e.stopPropagation()
          toggle()
        }}
      >
        {selected.comparator}
        {displayMenu ? <AlignedUp /> : <AlignedDown />}
      </ComparatorSelected>
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
