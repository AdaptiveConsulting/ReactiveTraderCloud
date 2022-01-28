import { useEffect, useRef, useState } from "react"
import { FaFilter, FaTimes } from "react-icons/fa"
import styled from "styled-components"
import { onQuickFilterInput } from "../TradesState"

const QuickFilterStyle = styled("div")`
  width: 10rem;
  display: flex;
  align-items: center;
  height: 1.25rem;
  position: relative;
`

const QuickFilterInput = styled("input")`
  opacity: 0.59;
  background: none;
  border: none;
  color: ${({ theme }) => theme.core.textColor};
  box-shadow: 0 0.0625rem 0 ${({ theme }) => theme.core.textColor};
  width: 100%;
  font-size: 0.75rem;
  height: 1.25rem;
  padding: 0 0.875rem 0 0.375rem;
  outline: none;

  &:hover {
    opacity: 1;
    box-shadow: 0 0.0625rem 0 ${({ theme }) => theme.accents.primary.lighter};
  }

  &:focus {
    box-shadow: 0 0.0625rem 0 ${({ theme }) => theme.accents.primary.base};
    color: ${({ theme }) => theme.core.textColor};
    opacity: 1;
  }

  //Removes default clear icon
  ::-webkit-search-cancel-button {
    -webkit-appearance: none;
  }
`

const QuickFilterIcon = styled("div")`
  width: 0.875rem;
  margin: 0 0.25rem;
  opacity: 0.59;
  cursor: pointer;
`

const QuickFilterClearIcon = styled("i")`
  width: 0.6875rem;
  position: absolute;
  right: 0.75rem;

  i {
    opacity: 0.59;
    cursor: pointer;
    color: ${({ theme }) => theme.core.textColor};
  }
`

export const QuickFilter: React.FC = () => {
  const quickFilterInput = useRef<HTMLInputElement>(null)
  const [quickFilterText, setQuickFilterText] = useState<string>("")

  useEffect(() => {
    onQuickFilterInput(quickFilterText.toLowerCase())
  }, [quickFilterText])

  return (
    <QuickFilterStyle
      role="search"
      aria-label="Search by text across all trade fields"
    >
      <QuickFilterIcon onClick={() => quickFilterInput.current?.focus()}>
        <FaFilter aria-hidden="true" />
      </QuickFilterIcon>
      <QuickFilterInput
        ref={quickFilterInput}
        type="search"
        placeholder="Filter"
        value={quickFilterText}
        onChange={(event) => setQuickFilterText(event.target.value)}
        role="textbox"
        data-qa="quick-filer__filter-input"
      />
      <QuickFilterClearIcon
        onClick={() => setQuickFilterText("")}
        data-qa="quick-filter__filter-clear-icon"
      >
        {quickFilterText.length ? <FaTimes /> : null}
      </QuickFilterClearIcon>
    </QuickFilterStyle>
  )
}
