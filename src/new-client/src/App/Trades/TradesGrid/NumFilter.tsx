import React, { useRef } from "react"
import { usePopUpMenu } from "utils/usePopUpMenu"
import styled from "styled-components/macro"
import {
  NumColField,
  ComparatorType,
  onColFilterEnterNum,
  useAppliedNumFilters,
} from "../TradesState"

export const FilterPopupWrapper = styled.span`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: transparent;
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

export const FilterPopup = styled.div`
  position: absolute;
  width: fit-content;
  min-height: 100%;
  max-height: 8rem;
  overflow-y: auto;
  top: 2rem;
  left: 10%;
  background-color: ${({ theme }) => theme.primary.base};
  padding: 6px;
  box-shadow: ${({ theme }) => theme.core.textColor} 0px 0px 0.3125rem 0px;
`

export const FilterOptionMenuWrapper = styled.div`
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

  .dd-placeholder {
    padding-right: 20px;
  }

  i {
    font-size: 10px;
  }
`

export const FilterOptionMenu = styled.div<{ visible: boolean }>`
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

export const FilterOption = styled.div`
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

  i {
    padding-left: 20px;
  }
`
const FilterValueInput = styled.input`
  grid-area: Input;
  background: none;
  text-align: center;
  outline: none;
  border: none;
  font-size: 0.75rem;
  width: 100%;
  padding: 2px 0;
  color: ${({ theme }) => theme.core.textColor};
  border-bottom: 1.5px solid ${({ theme }) => theme.primary[5]};
  caret-color: ${({ theme }) => theme.primary.base};
  &:focus {
    outline: none !important;
    border-color: ${({ theme }) => theme.accents.primary.base};
  }
`

export const NumFilter: React.FC<{
  field: NumColField
  parentRef: React.RefObject<HTMLDivElement>
}> = ({ field, parentRef }) => {
  const selected = useAppliedNumFilters(field)

  const innerRef = useRef<HTMLDivElement>(null)
  const { displayMenu, setDisplayMenu } = usePopUpMenu(innerRef)
  const toggle = () => setDisplayMenu(!displayMenu)

  return (
    <FilterPopupWrapper>
      <FilterPopup ref={parentRef}>
        <FilterOptionMenuWrapper>
          <div
            onClick={() => {
              toggle()
            }}
          >
            {selected.comparator}
          </div>
          {
            <FilterOptionMenu visible={displayMenu} ref={innerRef}>
              {Object.values(ComparatorType).map((comparator) => {
                return (
                  <FilterOption
                    key={comparator}
                    className="compare-option"
                    onClick={() => {
                      onColFilterEnterNum(field, {
                        ...selected,
                        comparator,
                      })
                      setDisplayMenu(false)
                    }}
                  >
                    {comparator}
                  </FilterOption>
                )
              })}
            </FilterOptionMenu>
          }
        </FilterOptionMenuWrapper>
        <br />
        <FilterValueInput
          onClick={(e) => e.stopPropagation()}
          onChange={({ target: { value } }) => {
            onColFilterEnterNum(field, {
              ...selected,
              value1: value ? parseInt(value) : null,
            })
          }}
          value={selected.value1 ?? undefined}
        />
        {selected.comparator === ComparatorType.InRange && (
          <FilterValueInput
            onClick={(e) => e.stopPropagation()}
            onChange={({ target: { value } }) => {
              onColFilterEnterNum(field, {
                ...selected,
                value2: value ? parseInt(value) : null,
              })
            }}
            value={selected.value2 ?? undefined}
          />
        )}
      </FilterPopup>
    </FilterPopupWrapper>
  )
}
