import React from 'react'
import { styled } from 'rt-util'

interface QuickFilterProps {
  isFilterApplied: boolean
  removeQuickFilter: () => void
  quickFilterChangeHandler: (event: React.FormEvent<any>) => void
}

interface QuickFilterState {
  quickFilterText: string
}

const QuickFilterStyle = styled('div')`
  padding: 0px 10px;
  width: 160px;
  display: flex;
  align-items: flex-start;
  height: 20px;
  position: relative;
`

const QuickFilterInput = styled('input')`
  color: ${({ theme: { text } }) => text.textMeta};
  background-color: ${({ theme: { background } }) => background.backgroundPrimary};
  border: none;
  border-bottom: 1px solid ${({ theme: { text } }) => text.textTertiary};
  width: 100%;
  font-size: 12px;
  height: 20px;
  padding: 0px 14px 0px 6px;
  outline: none;

  &:hover {
    border-bottom: 1px solid ${({ theme: { palette } }) => palette.accentPrimary.light};
  }

  &:focus {
    border-bottom: 1px solid ${({ theme: { palette } }) => palette.accentPrimary.normal};
    color: ${({ theme: { text } }) => text.textPrimary};
  }
`

const QuickFilterIcon = styled('div')`
  width: 14px;
  margin: 0px 4px;
`

const QuickFilterClearIcon = styled('i')`
  width: 11px;
  position: absolute;
  right: 12px;

  i {
    cursor: pointer;
    color: ${({ theme: { text } }) => text.textMeta};
  }
`

export default class QuickFilter extends React.Component<QuickFilterProps, QuickFilterState> {
  private quickFilterInput = React.createRef<HTMLInputElement>()

  state = {
    quickFilterText: ''
  }

  render() {
    return (
      <QuickFilterStyle>
        <QuickFilterIcon onClick={this.quickFilterFocus}>
          <i className="fas fa-filter" aria-hidden="true" />
        </QuickFilterIcon>
        <QuickFilterInput
          innerRef={this.quickFilterInput}
          type="text"
          placeholder="Filter"
          value={this.state.quickFilterText}
          onChange={(event: React.FormEvent<any>) => this.quickFilterChangeHandler(event)}
        />
        <QuickFilterClearIcon onClick={this.removeQuickFilter}>
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

  private quickFilterFocus = () => this.quickFilterInput.current && this.quickFilterInput.current.focus()
}
