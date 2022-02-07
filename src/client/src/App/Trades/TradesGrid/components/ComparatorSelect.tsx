import styled from "styled-components"
import type { NumFilterContent } from "../../TradesState"
import { ComparatorType } from "../../TradesState"
import { DateFilterContent } from "../../TradesState/filterState/dateFilterState"
import { colors, Theme } from "@/theme"

export const ComparatorSelectOuter = styled.div`
  display: block;
  position: relative;
  width: 10rem;
  background-color: ${({ theme }) => theme.core.lightBackground};
  color: ${({ theme }) => theme.core.textColor};
  font-size: 12px;
  outline: none;
  padding: 8px 15px 5px 10px;
  cursor: pointer;
  transition: all 200ms ease;
  text-transform: none;
  text-align: left;
  border-bottom: 1px solid ${colors.spectrum.blue.base};
`
const textColor = ({ theme }: { theme: Theme }) => theme.textColor

const ComparatorSelectInner = styled.select`
  color: ${textColor};
  &:focus {
    outline: none;
  }
  &:hover {
    cursor: pointer;
  }
  display: inline-block;
  padding: 0.2em 0;
  width: 105%;

  /* caret */
  background-image: linear-gradient(45deg, transparent 50%, ${textColor} 50%),
    linear-gradient(135deg, ${textColor} 50%, transparent 50%);
  background-position: calc(100% - 5px) center, calc(100%) center;
  background-size: 5px 5px, 5px 5px;

  option {
    background-color: ${({ theme }) => theme.core.lightBackground};
  }
`

export const ComparatorSelect: React.FC<{
  selected: DateFilterContent | NumFilterContent
  onSelection: (comparator: ComparatorType) => void
}> = ({ selected, onSelection }) => {
  return (
    <ComparatorSelectOuter>
      <ComparatorSelectInner
        onChange={(e) => {
          onSelection(e.target.value as ComparatorType)
        }}
        value={selected.comparator}
      >
        {Object.values(ComparatorType).map((comparator) => (
          <option key={comparator}>{comparator}</option>
        ))}
      </ComparatorSelectInner>
    </ComparatorSelectOuter>
  )
}
