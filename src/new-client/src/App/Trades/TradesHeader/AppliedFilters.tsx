import { FaTimes } from "react-icons/fa"
import styled from "styled-components"
import { colConfigs, onFilterReset, useFilterFields } from "../TradesState"

const FilterButton = styled("button")`
  opacity: 0.59;
  height: 1em;
  line-height: 1em;
`
const FilterField = styled("div")`
  display: flex;
  align-items: normal;
  font-size: 0.6875rem;
  text-transform: uppercase;
  background-color: ${({ theme }) => theme.core.lightBackground};
  margin-left: 0.5rem;
  border-radius: 0.25rem;
  height: 1.25rem;
  padding: 0 0.375rem;
  cursor: default;
  align-items: center;

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

export const AppliedFilters: React.FC = () => {
  const filterFields = useFilterFields()
  return (
    <>
      {filterFields.map((field) => (
        <FilterField key={field}>
          <FilterName>{colConfigs[field].headerName}</FilterName>
          <FilterButton>
            <FaTimes onClick={() => onFilterReset(field)} />
          </FilterButton>
        </FilterField>
      ))}
    </>
  )
}
