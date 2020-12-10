import { bind } from "@react-rxjs/core"
import { GridApi } from "ag-grid-community"
import { map } from "rxjs/operators"
import styled from "styled-components/macro"
import { filterChanges$, useGridApi } from "../BlotterGrid"

const FilterButton = styled("button")`
  opacity: 0.59;
`

const FilterField = styled("div")`
  display: flex;
  align-items: center;
  font-size: 0.6875rem;
  text-transform: uppercase;
  background-color: ${({ theme }) => theme.core.lightBackground};
  margin-left: 0.5rem;
  border-radius: 0.25rem;
  height: 1.25rem;
  padding: 0 0.375rem;
  cursor: default;

  &:hover {
    background-color: ${({ theme }) => theme.core.alternateBackground};
    ${FilterButton} {
      opacity: 1;
    }
  }
`

const FilterName = styled("div")`
  padding-right: 0.625rem;
`

const FilterIcon = styled("i")`
  line-height: 1rem;
`

const [useFilteredColDefs] = bind(
  filterChanges$.pipe(
    map(({ api }) =>
      Object.keys(api.getFilterModel()).map((colKey) =>
        api.getColumnDef(colKey),
      ),
    ),
  ),
  [],
)

export const AppliedFilters: React.FC = () => {
  const api = useGridApi()
  const filteredColDefs = useFilteredColDefs()
  return (
    <>
      {filteredColDefs.map((colDef) => (
        <FilterField key={colDef.field}>
          <FilterName>{colDef.headerName}</FilterName>
          <FilterButton>
            <FilterIcon
              className="fas fa-times"
              onClick={() => {
                if (colDef.colId && api instanceof GridApi) {
                  api.destroyFilter(colDef.colId)
                }
              }}
              data-qa="applied-filters___remove-filter-button"
            />
          </FilterButton>
        </FilterField>
      ))}
    </>
  )
}
