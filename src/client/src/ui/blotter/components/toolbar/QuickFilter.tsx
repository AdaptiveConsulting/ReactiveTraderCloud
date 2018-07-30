import React from 'react'
import { styled } from 'rt-util'
import { FILTER_APPLIED_ICON, FILTER_ICON } from './Icons'

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
`

const QuickFilterInputWrap = styled('div')`
  display: flex;
  align-items: center;
`

const QuickFilterInput = styled('input')`
  color: ${({ theme: { palette } }) => palette.textMeta};
  background-color: ${({ theme: { palette } }) => palette.backgroundPrimary};
  border: none;
  border-bottom: 1px solid ${({ theme: { palette } }) => palette.textTertiary};
  width: 100%;
  font-size: 12px;
  height: 20px;
  padding: 0px 4px;
`

const QuickFilterIcon = styled('div')`
  width: 11px;
`

const QuickFilterClearIcon = styled('div')`
  width: 11px;
  i {
    cursor: pointer;
  }
`

export default class QuickFilter extends React.Component<QuickFilterProps, QuickFilterState> {
  private quickFilterInput: HTMLInputElement

  state = {
    quickFilterText: ''
  } as QuickFilterState

  render() {
    const filterIcon = this.props.isFilterApplied ? FILTER_APPLIED_ICON : FILTER_ICON
    return (
      <QuickFilterStyle>
        <QuickFilterIcon onClick={() => this.quickFilterInput.focus()}>{filterIcon}</QuickFilterIcon>
        <QuickFilterInputWrap>
          <QuickFilterInput
            ref={el => (this.quickFilterInput = el)}
            type="text"
            placeholder="Filter"
            value={this.state.quickFilterText}
            onChange={(event: React.FormEvent<any>) => this.quickFilterChangeHandler(event)}
          />
          <QuickFilterClearIcon onClick={this.removeQuickFilter}>
            {this.props.isFilterApplied && <i className="fa fa-times" />}
          </QuickFilterClearIcon>
        </QuickFilterInputWrap>
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
}
