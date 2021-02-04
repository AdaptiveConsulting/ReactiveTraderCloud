import React, { useRef } from "react"
import { usePopUpMenu } from "utils/usePopUpMenu"
import styled from "styled-components/macro"
import {
  NumColField,
  comparatorConfigs,
  ComparatorType,
  onColFilterEnterNum,
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

export const FilterOptionMenu = styled.div<{
  visible: boolean
}>`
  display: ${({ visible }) => (visible ? "block" : "none")};
  border-radius: 4px;
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

interface NumFilterProps {
  field: NumColField
  comparator: string
  setComparator: React.Dispatch<React.SetStateAction<string>>
  value1: React.MutableRefObject<string | null>
  value2: React.MutableRefObject<string | null>
}

export const NumFilter: React.FC<NumFilterProps> = ({
  field,
  comparator,
  setComparator,
  value1,
  value2,
}) => {
  const innerRef = useRef<HTMLDivElement>(null)
  const { displayMenu, setDisplayMenu } = usePopUpMenu(innerRef)

  const toggle = () => setDisplayMenu(!displayMenu)
  const changeComparator = (comparator: string) => {
    setComparator(comparator)
    if (value1.current) {
      const filterDetails = {
        comparator: comparator as ComparatorType,
        value1: parseInt(value1.current),
      }
      if (comparator !== "InRange") {
        onColFilterEnterNum(field, filterDetails)
      } else {
        if (value2.current) {
          const filterDetails = {
            comparator: comparator as ComparatorType,
            value1: parseInt(value1.current),
            value2: parseInt(value2.current),
          }
          onColFilterEnterNum(field, filterDetails)
        }
      }
    }
  }

  const changeValue1 = (value: string) => {
    value1.current = value
    const filterDetails = {
      comparator: comparator as ComparatorType,
      value1: value1.current ? parseInt(value1.current) : null,
    }
    if (comparator !== "InRange") {
      onColFilterEnterNum(field, filterDetails)
    }
  }

  const changeValue2 = (value: string) => {
    value2.current = value
    const filterDetails = {
      comparator: comparator as ComparatorType,
      value1: value1.current ? parseInt(value1.current) : null,
      value2: value2.current ? parseInt(value2.current) : null,
    }
    onColFilterEnterNum(field, filterDetails)
  }
  return (
    <FilterPopupWrapper>
      <FilterPopup>
        <FilterOptionMenuWrapper onClick={toggle} ref={innerRef}>
          <div>{comparatorConfigs[comparator as ComparatorType]}</div>

          <FilterOptionMenu visible={displayMenu}>
            {Object.keys(comparatorConfigs).map((comparator) => {
              return (
                <FilterOption
                  key={comparator}
                  className="compare-option"
                  onClick={() => changeComparator(comparator)}
                >
                  {comparatorConfigs[comparator as ComparatorType]}
                </FilterOption>
              )
            })}
          </FilterOptionMenu>
        </FilterOptionMenuWrapper>
        <br></br>
        <FilterValueInput
          onChange={({ target: { value } }) => changeValue1(value)}
          value={value1.current ? value1.current : undefined}
        />
        {comparator === "InRange" && (
          <FilterValueInput
            onChange={({ target: { value } }) => changeValue2(value)}
            value={value2.current ? value2.current : undefined}
          />
        )}
      </FilterPopup>
    </FilterPopupWrapper>
  )
}
