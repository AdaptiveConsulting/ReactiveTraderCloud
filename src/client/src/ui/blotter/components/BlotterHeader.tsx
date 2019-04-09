import { GridApi } from 'ag-grid'
import React, { useCallback, useState } from 'react'
import { flexStyle } from 'rt-components'
import { PopoutIcon } from 'rt-components'
import { styled } from 'rt-theme'
import { columnDefinitions } from './blotterUtils'
import BlotterToolbar from './toolbar/BlotterToolbar'
import ExcelButton from './toolbar/ExcelButton'

interface Props {
  canPopout: boolean
  onPopoutClick: () => void
  onExportToExcelClick: () => void
  gridApi: GridApi | null
}

const BlotterHeaderStyle = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.5rem;
  height: 2.5rem;
  background-color: ${({ theme }) => theme.core.darkBackground};
`

const BlotterControls = styled('button')`
  .svg-icon {
    opacity: 0.59;
    fill: ${({ theme }) => theme.core.textColor};
    stroke: ${({ theme }) => theme.core.textColor};
  }
`

const BlotterRight = styled('div')`
  ${flexStyle({ alignItems: 'center' })};
`

const BlotterLeft = styled('div')`
  font-size: 0.9375rem;
`

const Fill = styled.div`
  width: 1rem;
  height: 1rem;
`

const BlotterHeader = (props: Props) => {
  const [quickFilterText, setQuickFilterText] = useState('')

  const quickFilterChangeHandler = useCallback(
    event => {
      setQuickFilterText(event.currentTarget.value)
      return props.gridApi && props.gridApi.setQuickFilter(event.currentTarget.value)
    },
    [setQuickFilterText, props.gridApi],
  )

  const removeQuickFilter = useCallback(() => {
    if (!props.gridApi) {
      return
    }
    props.gridApi.setQuickFilter(null)
    props.gridApi.onFilterChanged()
    setQuickFilterText('')
  }, [props.gridApi, setQuickFilterText])

  const removeAllFilters = useCallback(() => {
    return props.gridApi && props.gridApi.setFilterModel(null)
  }, [props.gridApi])

  const removeFilter = useCallback(
    (key: string) => {
      return props.gridApi && props.gridApi.destroyFilter(key)
    },
    [props.gridApi],
  )

  return (
    <BlotterHeaderStyle>
      <BlotterLeft>Executed Trades</BlotterLeft>
      <BlotterRight>
        <ExcelButton onClick={props.onExportToExcelClick} />
        <BlotterToolbar
          isQuickFilterApplied={quickFilterText.length !== 0}
          quickFilterChangeHandler={quickFilterChangeHandler}
          removeQuickFilter={removeQuickFilter}
          removeAllFilters={removeAllFilters}
          removeFilter={removeFilter}
          filterModel={props.gridApi ? props.gridApi.getFilterModel() : null}
          columnDefinitions={columnDefinitions}
        />
        {props.canPopout && (
          <React.Fragment>
            <Fill />
            <BlotterControls onClick={props.onPopoutClick}>
              <PopoutIcon width={0.8125} height={0.75} />
            </BlotterControls>
          </React.Fragment>
        )}
      </BlotterRight>
    </BlotterHeaderStyle>
  )
}

export default BlotterHeader
