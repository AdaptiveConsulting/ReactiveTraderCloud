import { IFilterParams, ProcessRowParams } from "ag-grid-community"
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { Option } from "./Option"

export const SetFilter = forwardRef<unknown, IFilterParams>(
  ({ filterChangedCallback, rowModel, valueGetter }, ref) => {
    const [selectedFreeText, setSelectedFreeText] = useState("")
    const [selectedValues, setSelectedValues] = useState(() => {
      const initialValues = new Set<string>()
      rowModel.forEachNode((rowNode) => {
        if (rowModel.isRowPresent(rowNode)) {
          initialValues.add(valueGetter(rowNode))
        }
      })
      return initialValues
    })

    const inputRef = useRef<HTMLInputElement>(null)

    const uniqueValues = new Set<string>()
    rowModel.forEachNode((rowNode) => {
      uniqueValues.add(valueGetter(rowNode))
    })

    useEffect(() => {
      setSelectedValues(
        new Set(
          [...uniqueValues].filter((value) =>
            value.toLowerCase().includes(selectedFreeText.toLowerCase()),
          ),
        ),
      )
    }, [selectedFreeText])

    useEffect(() => {
      filterChangedCallback()
    }, [selectedValues, filterChangedCallback])

    useImperativeHandle(ref, () => ({
      isFilterActive: () => selectedValues.size > 0,
      doesFilterPass: ({ node }: ProcessRowParams) =>
        selectedValues.has(valueGetter(node)),
      getModel: () =>
        selectedFreeText.trim().length > 0 ? selectedFreeText : undefined,
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
            value={selectedFreeText}
            onChange={({ target }) => setSelectedFreeText(target.value)}
            className="filter-container__free-text-input"
            data-qa="set-filter__filter-input"
          />
          <div className="filter_container__select-all-option-container">
            <Option
              value="Select All"
              label="Select All"
              checked={[...uniqueValues].every((value) =>
                selectedValues.has(value),
              )}
              onChange={(event) => {
                if (event.target.checked) {
                  setSelectedValues(new Set())
                }
              }}
            />
          </div>
          <div className="filter_container__option-items-wrapper">
            <div className="filter_container__option-items-container">
              {[...uniqueValues].map((value) => (
                <Option
                  key={value}
                  value={value}
                  label={value}
                  checked={selectedValues.has(value)}
                  onChange={(event) => {
                    const checked = event.target.checked
                    setSelectedValues((old) => {
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
