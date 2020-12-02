import React, { useCallback, useState, FC, MouseEvent } from 'react'
import { GridApi } from 'ag-grid-community'
import { flexStyle, PopoutIcon } from 'rt-components'
import styled from 'styled-components/macro'
import { columnDefinitions } from './blotterUtils'
import BlotterToolbar from './toolbar/BlotterToolbar'
import ExcelButton from './toolbar/ExcelButton'
import { PopoutButton } from 'rt-components/styled'

interface Props {
  canPopout: boolean
  onPopoutClick: (x: number, y: number) => void
  onExportToExcelClick: () => void
  gridApi?: GridApi
}

const BlotterHeaderStyle = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.5rem;
  height: 2.5rem;
  background-color: ${({ theme }) => theme.core.darkBackground};
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
    (event: MouseEvent) => {
      onPopoutClick(event.screenX, event.screenY)
    },
    [onPopoutClick]
  )

  const [quickFilterText, setQuickFilterText] = useState('')

  const quickFilterChangeHandler = useCallback(
    event => {
      setQuickFilterText(event.currentTarget.value)
      return gridApi && gridApi.setQuickFilter(event.currentTarget.value)
    },
    [setQuickFilterText, gridApi]
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
      <BlotterLeft>Trades</BlotterLeft>
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
            <PopoutButton onClick={popoutClickHandler} data-qa="blotter-header__pop-out-button">
              {PopoutIcon}
            </PopoutButton>
          </React.Fragment>
        )}
      </BlotterRight>
    </BlotterHeaderStyle>
  )
}

export default BlotterHeader
