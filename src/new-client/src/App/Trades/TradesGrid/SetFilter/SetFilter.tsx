import { IFilterParams, ProcessRowParams } from "ag-grid-community"
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
import { Option } from "./Option"

/**
 *
 * Guides used for constructing this component:
 *
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
    const [selectedFilters, setSelectedFilters] = useState(
      () => new Set<string>(filterOptions),
    )
    const inputRef = useRef<HTMLInputElement>(null)

    const resetFilters = useCallback(
      () => setSelectedFilters(new Set<string>(filterOptions)),
      [setSelectedFilters, filterOptions],
    )

    useEffect(() => {
      if (!filterSearchText.length) {
        resetFilters()
      } else {
        setSelectedFilters(
          new Set(
            [...filterOptions].filter((filterOption) =>
              filterOption
                .toLowerCase()
                .includes(filterSearchText.toLowerCase()),
            ),
          ),
        )
      }
    }, [filterSearchText, filterOptions, resetFilters])

    useEffect(() => {
      filterChangedCallback()
    }, [selectedFilters, filterChangedCallback])

    useImperativeHandle(ref, () => {
      const filterActive =
        selectedFilters.size > 0 && selectedFilters.size < filterOptions.size
      return {
        isFilterActive: () => filterActive,
        doesFilterPass: ({ node }: ProcessRowParams) =>
          selectedFilters.has(valueGetter(node)),
        getModel: () => (filterActive ? [...selectedFilters] : null),
        /**
         * Modelled on https://www.ag-grid.com/javascript-grid-filter-set-api/
         *
         * Since this method is called outside the component and updates internal
         * state, make sure caller is using correct contract.
         */
        setModel: (model: { values: string[] } | null) => {
          if (model == null) {
            resetFilters()
          } else if (
            model.values.every((filter) => filterOptions.has(filter))
          ) {
            setSelectedFilters(new Set(model.values))
          }
        },
        afterGuiAttached: () => {
          inputRef.current?.focus()
        },
      }
    })

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
                  resetFilters()
                } else {
                  setSelectedFilters(new Set<string>())
                }
              }}
            />
          </div>
          <div className="filter_container__option-items-wrapper">
            <div className="filter_container__option-items-container">
              {[...filterOptions].map((option) => (
                <Option
                  key={option}
                  value={option}
                  label={option}
                  checked={selectedFilters.has(option)}
                  onChange={(event) => {
                    const checked = event.target.checked
                    setSelectedFilters((previousSelectedFilters) => {
                      const nextSelectedFilters = new Set(
                        previousSelectedFilters,
                      )
                      if (checked) {
                        nextSelectedFilters.add(option)
                      } else {
                        nextSelectedFilters.delete(option)
                      }
                      return nextSelectedFilters
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
