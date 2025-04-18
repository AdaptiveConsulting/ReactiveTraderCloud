import { useEffect, useRef, useState } from "react"
import { FaTimes } from "react-icons/fa"
import styled from "styled-components"

import { FilterEditIcon } from "@/client/components/icons/FilterEditIcon"

import { onQuickFilterInput } from "../TradesState"

const QuickFilterStyle = styled("div")`
  width: 10rem;
  display: flex;
  align-items: center;
  height: 1.25rem;
  position: relative;
`

const QuickFilterInput = styled("input")`
  color: ${({ theme }) => theme.color["Colors/Text/text-primary (900)"]};
  width: 100%;
  height: 1.25rem;
  padding: 0 ${({ theme }) => theme.spacing.sm};
  outline: none;
  user-select: text;
  border-bottom: 1px solid
    ${({ theme }) => theme.color["Colors/Text/text-brand-primary (900)"]};
  opacity: 0.5;

  &:hover {
    opacity: 1;
  }

  &:focus {
    opacity: 1;
  }

  //Removes default clear icon
  ::-webkit-search-cancel-button {
    -webkit-appearance: none;
  }
`

const QuickFilterClearIcon = styled("i")`
  width: 0.6875rem;
  position: absolute;
  right: 0;

  i {
    opacity: 0.59;
    cursor: pointer;
    color: ${({ theme }) => theme.color["Colors/Text/text-primary (900)"]};
  }
`

export const QuickFilter = () => {
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
      <div onClick={() => quickFilterInput.current?.focus()}>
        {<FilterEditIcon />}
      </div>
      <QuickFilterInput
        ref={quickFilterInput}
        type="search"
        placeholder="Filter"
        value={quickFilterText}
        onChange={(event) => setQuickFilterText(event.target.value)}
        role="textbox"
      />
      <QuickFilterClearIcon onClick={() => setQuickFilterText("")}>
        {quickFilterText.length ? <FaTimes /> : null}
      </QuickFilterClearIcon>
    </QuickFilterStyle>
  )
}
