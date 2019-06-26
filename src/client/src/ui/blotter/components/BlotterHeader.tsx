import { GridApi } from 'ag-grid'
import React, { useCallback, useState, FC } from 'react'
import { flexStyle } from 'rt-components'
import { PopoutIcon } from 'rt-components'
import { styled } from 'rt-theme'
import { columnDefinitions } from './blotterUtils'
import BlotterToolbar from './toolbar/BlotterToolbar'
import ExcelButton from './toolbar/ExcelButton'

interface Props {
  canPopout: boolean
  onPopoutClick: (x: number, y: number) => void
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

const BlotterHeader: FC<Props> = ({ gridApi, canPopout, onExportToExcelClick, onPopoutClick }) => {
  const popoutClickHandler = useCallback(
    event => {
      onPopoutClick(event.screenX, event.screenY)
    },
    [onPopoutClick],
  )

  const [quickFilterText, setQuickFilterText] = useState('')

  const quickFilterChangeHandler = useCallback(
    event => {
      setQuickFilterText(event.currentTarget.value)
      return gridApi && gridApi.setQuickFilter(event.currentTarget.value)
    },
    [setQuickFilterText, gridApi],
  )

  const removeQuickFilter = useCallback(() => {
    if (!gridApi) {
      return
    }
    gridApi.setQuickFilter(null)
    gridApi.onFilterChanged()
    setQuickFilterText('')
  }, [gridApi, setQuickFilterText])

  const removeAllFilters = useCallback(() => gridApi && gridApi.setFilterModel(null), [gridApi])

  const removeFilter = useCallback((key: string) => gridApi && gridApi.destroyFilter(key), [
    gridApi,
  ])

  return (
    <BlotterHeaderStyle>
      <BlotterLeft>Executed Trades</BlotterLeft>
      <BlotterRight>
        <ExcelButton onClick={onExportToExcelClick} />
        <BlotterToolbar
          isQuickFilterApplied={quickFilterText.length !== 0}
          quickFilterChangeHandler={quickFilterChangeHandler}
          removeQuickFilter={removeQuickFilter}
          removeAllFilters={removeAllFilters}
          removeFilter={removeFilter}
          filterModel={gridApi ? gridApi.getFilterModel() : null}
          columnDefinitions={columnDefinitions}
        />
        {canPopout && (
          <React.Fragment>
            <Fill />
            <BlotterControls onClick={popoutClickHandler}>
              <PopoutIcon width={0.8125} height={0.75} />
            </BlotterControls>
          </React.Fragment>
        )}
      </BlotterRight>
    </BlotterHeaderStyle>
  )
}

export default BlotterHeader
