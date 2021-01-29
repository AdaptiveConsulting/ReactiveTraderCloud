import React from "react"
import styled from "styled-components/macro"
import { FaCheck } from "react-icons/fa"
import {
  colConfigs,
  ColField,
  onColFilterToggle,
  useAppliedFieldFilters,
  useDistinctFieldValues,
  ColFieldToggle,
} from "../TradesState"

export const MultiSelectWrapper = styled.span`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.core.lightBackground};
  border-radius: 4px;
  color: ${({ theme }) => theme.core.textColor};
  font-size: 12px;
  padding: 8px 15px 5px 15px;
  cursor: pointer;
  display: inline-block;

  @media (max-width: 400px) {
    display: none;
  }
`

export const MultiSelectMenu = styled.div`
  position: absolute;
  width: fit-content;
  min-height: 100%;
  max-height: 8rem;
  overflow-y: auto;
  top: 0px;
  right: 0px;
  background-color: ${({ theme }) => theme.primary.base};
  padding: 6px;
  box-shadow: ${({ theme }) => theme.core.textColor} 0px 0px 0.3125rem 0px;
`

export const MultiSelectOption = styled.div<{
  selected: boolean
  children: React.ReactNode
}>`
  padding: 8px 8px 5px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: ${({ selected }) => (selected ? "bold" : "normal")};
  background-color: ${({ selected, theme }) =>
    selected ? theme.core.activeColor : "inherit"};
  border-radius: 2px;
  margin-bottom: 5px;

  &:hover {
    background-color: ${({ theme }) => theme.core.backgroundHoverColor};
    font-weight: ${({ selected }) => (selected ? "bold" : "normal")};
    text-decoration: underline;
  }
`
const AlignedChecked = styled.span`
  margin-left: 0.675rem;
  min-width: 0.675rem;
`

interface SetFilterProps {
  field: ColField
  parentRef: React.RefObject<HTMLDivElement>
}

export const SetFilter: React.FC<SetFilterProps> = ({ field, parentRef }) => {
  const selected = useAppliedFieldFilters(field)
  const options = useDistinctFieldValues(field)
  const { valueFormatter } = colConfigs[field]
  return (
    <MultiSelectWrapper>
      <MultiSelectMenu ref={parentRef}>
        {[...options].map((option) => {
          const isSelected = selected.has(option)
          return (
            <MultiSelectOption
              key={`${option}-filter`}
              onClick={() =>
                onColFilterToggle(
                  new ColFieldToggle(field, option, !isSelected),
                )
              }
              selected={isSelected}
            >
              {valueFormatter?.(option) ?? option}
              <AlignedChecked>{isSelected && <FaCheck />}</AlignedChecked>
            </MultiSelectOption>
          )
        })}
      </MultiSelectMenu>
    </MultiSelectWrapper>
  )
}
