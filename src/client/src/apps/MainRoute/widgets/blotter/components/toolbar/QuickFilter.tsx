import React from 'react'
import { styled } from 'rt-theme'

interface QuickFilterProps {
  isFilterApplied: boolean
  removeQuickFilter: () => void
  quickFilterChangeHandler: (event: React.FormEvent<any>) => void
}

interface QuickFilterState {
  quickFilterText: string
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

export default class QuickFilter extends React.Component<QuickFilterProps, QuickFilterState> {
  private quickFilterInput = React.createRef<HTMLInputElement>()

  state = {
    quickFilterText: '',
  }

  render() {
    return (
      <QuickFilterStyle>
        <QuickFilterIcon onClick={this.quickFilterFocus} data-qa="quick-filter__filter-icon">
          <i className="fas fa-filter" aria-hidden="true" />
        </QuickFilterIcon>
        <QuickFilterInput
          ref={this.quickFilterInput}
          type="text"
          placeholder="Filter"
          value={this.state.quickFilterText}
          onChange={(event: React.FormEvent<any>) => this.quickFilterChangeHandler(event)}
          data-qa="quick-filer__filter-input"
        />
        <QuickFilterClearIcon
          onClick={this.removeQuickFilter}
          data-qa="quick-filter__filter-clear-icon"
        >
          {this.props.isFilterApplied && <i className="fas fa-times" />}
        </QuickFilterClearIcon>
      </QuickFilterStyle>
    )
  }

  private quickFilterChangeHandler = (event: React.FormEvent<any>) => {
    const target = event.target as HTMLInputElement
    this.setState({ quickFilterText: target.value })
    this.props.quickFilterChangeHandler(event)
  }

  private removeQuickFilter = () => {
    this.setState({ quickFilterText: '' })
    this.props.removeQuickFilter()
  }

  private quickFilterFocus = () =>
    this.quickFilterInput.current && this.quickFilterInput.current.focus()
}
