import React, { useCallback, useRef, useState } from 'react'
import { styled } from 'rt-theme'

interface QuickFilterProps {
  isFilterApplied: boolean
  removeQuickFilter: () => void
  quickFilterChangeHandler: (event: React.FormEvent<any>) => void
}

const QuickFilterStyle = styled('div')`
  width: 10rem;
  display: flex;
  align-items: center;
  height: 1.25rem;
  position: relative;
`

const QuickFilterInput = styled('input')`
  opacity: 0.59;
  background: none;
  border: none;
  box-shadow: 0 0.0625rem 0 ${({ theme }) => theme.core.textColor};
  width: 100%;
  font-size: 0.75rem;
  height: 1.25rem;
  padding: 0 0.875rem 0 0.375rem;
  outline: none;

  &:hover {
    opacity: 1;
    box-shadow: 0 0.0625rem 0 ${({ theme }) => theme.template.blue.light};
  }

  &:focus {
    box-shadow: 0 0.0625rem 0 ${({ theme }) => theme.template.blue.normal};
    color: ${({ theme }) => theme.core.textColor};
    opacity: 1;
  }
`

const QuickFilterIcon = styled('div')`
  width: 0.875rem;
  margin: 0 0.25rem;
  opacity: 0.59;
  cursor: pointer;
`

const QuickFilterClearIcon = styled('i')`
  width: 0.6875rem;
  position: absolute;
  right: 0.75rem;

  i {
    opacity: 0.59;
    cursor: pointer;
    color: ${({ theme }) => theme.core.textColor};
  }
`

const QuickFilter: React.FC<QuickFilterProps> = ({
  isFilterApplied,
  removeQuickFilter,
  quickFilterChangeHandler,
}) => {
  const quickFilterInput = useRef<HTMLInputElement>(null)
  const [quickFilterText, setQuickFilterText] = useState<string>('')

  const quickFilterOnChange = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      const target = event.target as HTMLInputElement // cast event.target
      setQuickFilterText(target.value)
      quickFilterChangeHandler(event)
    },
    [quickFilterChangeHandler],
  )

  const clearQuickFilter = useCallback(() => {
    setQuickFilterText('')
    removeQuickFilter()
  }, [removeQuickFilter])

  const quickFilterFocus = useCallback(() => {
    quickFilterInput.current && quickFilterInput.current.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <QuickFilterStyle>
      <QuickFilterIcon onClick={quickFilterFocus} data-qa="quick-filter__filter-icon">
        <i className="fas fa-filter" aria-hidden="true" />
      </QuickFilterIcon>
      <QuickFilterInput
        ref={quickFilterInput}
        type="text"
        placeholder="Filter"
        value={quickFilterText}
        onChange={quickFilterOnChange}
        data-qa="quick-filer__filter-input"
      />
      <QuickFilterClearIcon onClick={clearQuickFilter} data-qa="quick-filter__filter-clear-icon">
        {isFilterApplied && <i className="fas fa-times" />}
      </QuickFilterClearIcon>
    </QuickFilterStyle>
  )
}

export default QuickFilter
