import styled from "styled-components/macro"

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

export const AppliedFilters: React.FC = () => {
  const filteredColDefs: any[] = []
  return (
    <>
      {filteredColDefs.map((colDef) => (
        <FilterField key={colDef.field}>
          <FilterName>{colDef.headerName}</FilterName>
          <FilterButton>
            <FilterIcon
              className="fas fa-times"
              onClick={() => {
                console.log("TODO")
              }}
            />
          </FilterButton>
        </FilterField>
      ))}
    </>
  )
}
