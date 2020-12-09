import { IFilterParams, ProcessRowParams } from "ag-grid-community"
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
import { Option } from "./Option"

/**
 * https://www.ag-grid.com/javascript-grid-filter-component/
 * https://www.ag-grid.com/react-hooks/
 */
export const SetFilter = forwardRef<unknown, IFilterParams>(
  ({ filterChangedCallback, rowModel, valueGetter }, ref) => {
    const filterOptions = useMemo(() => {
      const options = new Set<string>()
      rowModel.forEachNode((rowNode) => {
        options.add(valueGetter(rowNode))
      })
      return options
    }, [rowModel, valueGetter])
    
    const [filterSearchText, setFilterSearchText] = useState("")
    const [selectedFilters, setSelectedFilters] = useState(() => new Set<string>())
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
      setSelectedFilters(
        new Set(
          [...filterOptions].filter((filterOption) =>
            filterOption.toLowerCase().includes(filterSearchText.toLowerCase()),
          ),
        ),
      )
    }, [filterSearchText, filterOptions])

    useEffect(() => {
      filterChangedCallback()
    }, [selectedFilters, filterChangedCallback])

    useImperativeHandle(ref, () => ({
      isFilterActive: () => selectedFilters.size > 0,
      doesFilterPass: ({ node }: ProcessRowParams) =>
        selectedFilters.has(valueGetter(node)),
      getModel: () =>
        filterSearchText.trim().length > 0 ? filterSearchText : undefined,
    }))

    return (
      <div className="filter-container">
        <div className="filter-container__tab">
          <div className="filter-container__tab-icon" />
        </div>
        <div className="filter-container__content-wrapper">
          <input
            key="searchInput"
            ref={inputRef}
            placeholder="Search"
            value={filterSearchText}
            onChange={({ target }) => setFilterSearchText(target.value)}
            className="filter-container__free-text-input"
            data-qa="set-filter__filter-input"
          />
          <div className="filter_container__select-all-option-container">
            <Option
              value="Select All"
              label="Select All"
              checked={[...filterOptions].every((filterOption) =>
                selectedFilters.has(filterOption),
              )}
              onChange={(event) => {
                if (event.target.checked) {
                  setSelectedFilters(new Set())
                }
              }}
            />
          </div>
          <div className="filter_container__option-items-wrapper">
            <div className="filter_container__option-items-container">
              {[...filterOptions].map((value) => (
                <Option
                  key={value}
                  value={value}
                  label={value}
                  checked={selectedFilters.has(value)}
                  onChange={(event) => {
                    const checked = event.target.checked
                    setSelectedFilters((old) => {
                      if (checked) {
                        old.add(value)
                      } else {
                        old.delete(value)
                      }
                      return new Set([...old])
                    })
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  },
)
