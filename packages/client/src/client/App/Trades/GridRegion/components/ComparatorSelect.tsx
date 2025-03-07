import styled from "styled-components"

import type { NumFilterContent } from "../../TradesState"
import { ComparatorType } from "../../TradesState"
import { DateFilterContent } from "../../TradesState/filterState/dateFilterState"

export const ComparatorSelectOuter = styled.div`
  display: block;
  position: relative;
  width: 10rem;
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-secondary"]};
  color: ${({ theme }) =>
    theme.newTheme.color["Colors/Text/text-primary (900)"]};
  outline: none;
  padding: 8px 15px 5px 10px;
  cursor: pointer;
  transition: all 200ms ease;
  text-transform: none;
  text-align: left;
  border-bottom: 1px solid
    ${({ theme }) => theme.newTheme.color["Colors/Border/border-brand"]};

  &:hover {
    background-color: ${({ theme }) =>
      theme.newTheme.color["Colors/Background/bg-secondary_hover"]};
  }
`

const ComparatorSelectInner = styled.select`
  ${({ theme }) => `
color: ${theme.newTheme.color["Colors/Text/text-primary (900)"]};
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
background-image:
  linear-gradient(45deg, transparent 50%, ${theme.newTheme.color["Colors/Text/text-primary (900)"]} 50%),
  linear-gradient(135deg, ${theme.newTheme.color["Colors/Text/text-primary (900)"]} 50%, transparent 50%);
background-position:
  calc(100% - 5px) center,
  calc(100%) center;
background-size:
  5px 5px,
  5px 5px;

option {
  background-color: ${theme.newTheme.color["Colors/Background/bg-secondary"]};
}

`}
`

export const ComparatorSelect = ({
  selected,
  onSelection,
}: {
  selected: DateFilterContent | NumFilterContent
  onSelection: (comparator: ComparatorType) => void
}) => {
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
