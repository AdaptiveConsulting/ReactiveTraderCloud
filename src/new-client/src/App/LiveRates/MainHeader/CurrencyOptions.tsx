import { useRef, useState } from "react"
import { usePopUpMenu } from "@/utils/usePopUpMenu"
import styled from "styled-components"
import { AllCurrencies, ALL_CURRENCIES } from "../selectedCurrency"
import { FaCheck, FaChevronDown, FaChevronUp } from "react-icons/fa"

interface Props {
  options: (string | AllCurrencies)[]
  onSelectionChange: (selection: string | AllCurrencies) => void
}

export const DropdownWrapper = styled.li`
  display: none;
  position: relative;
  background-color: ${({ theme }) => theme.core.lightBackground};
  border-radius: 4px;
  color: ${({ theme }) => theme.core.textColor};
  font-size: 12px;
  outline: none;
  padding: 8px 15px 5px 15px;
  cursor: pointer;
  transition: all 200ms ease;

  @media (max-width: 915px) {
    display: flex;
    justify-content: space-between;
  }

  @media (max-width: 400px) {
    padding-top: 10px;
  }

  .dd-placeholder {
    padding-right: 20px;
  }

  i {
    font-size: 10px;
  }
`

export const DropdownMenu = styled.div`
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

export const DropdownOption = styled.div<{ selected: boolean }>`
  padding: 8px 8px 5px 8px;
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

  i {
    padding-left: 20px;
  }
`
const AlignedChecked = styled(FaCheck)`
  position: relative;
  left: 20px;
  top: 2px;
`
const AlignedUp = styled(FaChevronUp)`
  position: relative;
  top: 2px;
`
const AlignedDown = styled(FaChevronDown)`
  position: relative;
  top: 2px;
`

export const CurrencyOptions: React.FC<Props> = ({
  options,
  onSelectionChange,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const { displayMenu, setDisplayMenu } = usePopUpMenu(ref)
  const [selected, setSelected] = useState("ALL")

  const toggle = () => setDisplayMenu(!displayMenu)

  const handleClick = (ccy: string | AllCurrencies) => {
    const currentOption = ccy === ALL_CURRENCIES ? "ALL" : (ccy as string)
    setSelected(currentOption)
    onSelectionChange(ccy)
  }

  return (
    <DropdownWrapper onClick={toggle}>
      <div className="dd-placeholder">{selected}</div>
      <div>{displayMenu ? <AlignedUp /> : <AlignedDown />}</div>

      {displayMenu && (
        <DropdownMenu ref={ref}>
          {options.map((ccyOption) => {
            const currentOption =
              ccyOption === ALL_CURRENCIES ? "ALL" : ccyOption
            return (
              <DropdownOption
                key={currentOption.toString()}
                className="dd-option"
                onClick={() => handleClick(ccyOption)}
                selected={selected === currentOption}
              >
                {currentOption}
                {selected === currentOption && <AlignedChecked />}
              </DropdownOption>
            )
          })}
        </DropdownMenu>
      )}
    </DropdownWrapper>
  )
}
