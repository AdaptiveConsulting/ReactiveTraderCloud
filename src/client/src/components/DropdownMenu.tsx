import { useRef, useState } from "react"
import { usePopUpMenu } from "@/utils/usePopUpMenu"
import styled from "styled-components"
import { FaCheck, FaChevronDown, FaChevronUp } from "react-icons/fa"

const DropdownLayout = styled.div`
  display: flex;
  position: relative;
  background-color: ${({ theme }) => theme.core.lightBackground};
  border-radius: 4px;
  color: ${({ theme }) => theme.core.textColor};
  font-size: 12px;
  padding: 8px 15px 5px 15px;
  cursor: pointer;
  transition: all 200ms ease;
`
const SelectedOption = styled.div`
  padding-right: 20px;
`
const DropdownOptions = styled.div`
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
const DropdownOption = styled.div<{ selected: boolean }>`
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

interface Props {
  selection?: string
  options: string[]
  onSelectionChange: (selection: string) => void
}

export const DropdownMenu: React.FC<Props> = ({
  selection,
  options,
  onSelectionChange,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const { displayMenu, setDisplayMenu } = usePopUpMenu(ref)
  const [selected, setSelected] = useState(selection ?? options[0])
  const toggleOpenCloseState = () => setDisplayMenu(!displayMenu)

  const handleSelection = (option: string) => {
    setSelected(option)
    onSelectionChange(option)
  }

  return (
    <DropdownLayout onClick={toggleOpenCloseState}>
      <SelectedOption>{selected}</SelectedOption>
      <div>{displayMenu ? <AlignedUp /> : <AlignedDown />}</div>
      {displayMenu && (
        <DropdownOptions ref={ref}>
          {options.map((option) => (
            <DropdownOption
              key={option}
              onClick={() => handleSelection(option)}
              selected={selected === option}
            >
              {option}
              {selected === option && <AlignedChecked />}
            </DropdownOption>
          ))}
        </DropdownOptions>
      )}
    </DropdownLayout>
  )
}
