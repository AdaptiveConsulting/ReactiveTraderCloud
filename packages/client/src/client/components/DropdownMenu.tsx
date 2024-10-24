import { useEffect, useRef, useState } from "react"
import { FaCheck, FaChevronDown, FaChevronUp } from "react-icons/fa"
import styled, { css } from "styled-components"

import { usePopUpMenu } from "@/client/utils/usePopUpMenu"

const DropdownLayout = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  width: ${({ theme }) => theme.newTheme.spacing["9xl"]};
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-tertiary"]};
  color: ${({ theme }) =>
    theme.newTheme.color["Colors/Text/text-tertiary (600)"]};
  font-size: 12px;
  padding: ${({ theme }) =>
    `${theme.newTheme.spacing.xs} ${theme.newTheme.spacing.md}`};
  cursor: pointer;
  transition: all 200ms ease;
`

const DropdownOptions = styled.div`
  position: absolute;
  top: 34px;
  left: 0px;
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-tertiary"]};
  box-shadow: 0 7px 26px 0 rgba(23, 24, 25, 0.5);
  z-index: 100;
  width: 100%;
`
const DropdownOption = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${({ theme }) => theme.newTheme.density.md};
  padding: ${({ theme }) =>
    `${theme.newTheme.spacing.xs} ${theme.newTheme.spacing.md}`};
  font-weight: ${({ selected }) => (selected ? "bold" : "normal")};
  color: ${({ theme, selected }) =>
    selected
      ? theme.newTheme.color["Colors/Text/text-brand-primary (900)"]
      : "inherit"};
  margin-bottom: 5px;

  &:hover {
    background-color: ${({ theme }) =>
      theme.newTheme.color["Colors/Background/bg-quaternary"]};
    font-weight: ${({ selected }) => (selected ? "bold" : "normal")};
  }
`

const chevronStyle = css`
  position: relative;
  color: ${({ theme }) =>
    theme.newTheme.color["Colors/Text/text-quaternary_on-brand"]};
  top: 2px;
`
const AlignedUp = styled(FaChevronUp)`
  ${chevronStyle}
`
const AlignedDown = styled(FaChevronDown)`
  ${chevronStyle}
`

interface Props<T extends string> {
  selectedOption?: T
  options: readonly T[]
  onSelectionChange: (selection: T) => void
}

export const DropdownMenu = <T extends string>({
  selectedOption,
  options,
  onSelectionChange,
}: Props<T>) => {
  const ref = useRef<HTMLDivElement>(null)
  const { displayMenu, setDisplayMenu } = usePopUpMenu(ref)
  const [selected, setSelected] = useState(selectedOption ?? options[0])
  const toggleOpenCloseState = () => setDisplayMenu(!displayMenu)

  useEffect(() => {
    if (selectedOption) {
      setSelected(selectedOption)
    }
  }, [selectedOption])

  const handleSelection = (option: T) => {
    setSelected(option)
    onSelectionChange(option)
  }

  return (
    <DropdownLayout onClick={toggleOpenCloseState}>
      <div>{selected}</div>
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
              {selected === option && <FaCheck />}
            </DropdownOption>
          ))}
        </DropdownOptions>
      )}
    </DropdownLayout>
  )
}
