import {
  creditInstrumentsByCusip$,
  useCreditInstrumentsByCusip,
} from "@/services/credit"
import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { useCombobox } from "downshift"
import { forwardRef, useCallback, useMemo, useRef, useState } from "react"
import { FaSearch } from "react-icons/fa"
import { map, withLatestFrom } from "rxjs/operators"
import styled from "styled-components"
import { CusipWithBenchmark } from "../common/CusipWithBenchmark"

const InstrumentSearchWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 2em;
`

const InputWrapper = styled.div`
  flex: 1 1 0;
`

const CreditInstrument = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const InstrumentName = styled.div`
  font-size: 15px;
`

const IconWrapper = styled.div`
  position: absolute;
  right: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
  height: 30px;
  width: 30px;
  color: ${({ theme }) => theme.secondary[5]};

  &:hover {
    cursor: pointer;
    color: ${({ theme }) => theme.accents.primary.base};
  }
`

export const [selectedInstrumentId$, setSelectedInstrumentId] =
  createSignal<number | null>()
export const [useSelectedInstrument] = bind(
  selectedInstrumentId$.pipe(
    withLatestFrom(creditInstrumentsByCusip$),
    map(([instrumentId, creditInstrumentsByCusip]) =>
      instrumentId !== null
        ? Object.values(creditInstrumentsByCusip).find(
            (instrument) => instrument.id === instrumentId,
          ) ?? null
        : null,
    ),
  ),
  null,
)

const useInputFocus = () => {
  const shouldFocusInputOnMount = useRef(false)
  const inputRef = useRef<HTMLInputElement | null>()

  const inputRefCallback = useCallback((node: HTMLInputElement | null) => {
    inputRef.current = node
    if (node && shouldFocusInputOnMount.current) {
      node.focus()
      shouldFocusInputOnMount.current = false
    }
  }, [])

  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    } else {
      shouldFocusInputOnMount.current = true
    }
  }, [])

  return { inputRef: inputRefCallback, focusInput }
}

export const CreditInstrumentSearch = () => {
  const selectedInstrument = useSelectedInstrument()
  const { inputRef, focusInput } = useInputFocus()

  const showAndResetInput = () => {
    setSelectedInstrumentId(null)
    focusInput()
  }

  return (
    <InstrumentSearchWrapper>
      <InputWrapper>
        {selectedInstrument ? (
          <CreditInstrument>
            <InstrumentName data-testid="instrument-name">
              {selectedInstrument.name}
            </InstrumentName>
            <CusipWithBenchmark
              cusip={selectedInstrument.cusip}
              benchmark={selectedInstrument.benchmark}
            />
          </CreditInstrument>
        ) : (
          <SearchBox ref={inputRef} />
        )}
      </InputWrapper>
      <IconWrapper onClick={showAndResetInput}>
        <FaSearch size="0.75em" />
      </IconWrapper>
    </InstrumentSearchWrapper>
  )
}

const SearchWrapper = styled.div`
  position: relative;
`

const SearchInput = styled.input`
  display: flex;
  padding: 6px;
  width: 100%;
  border-radius: 3px;
  border: 1px solid ${({ theme }) => theme.primary[2]};
  color: ${({ theme }) => theme.core.textColor};
  background-color: ${({ theme }) => theme.core.darkBackground};
  outline: none;
  cursor: text;

  &:focus {
    outline: none !important;
    border-color: ${({ theme }) => theme.accents.primary.base};
  }
`

const SearchResults = styled.div`
  position: absolute;
  z-index: 1000;
  width: 100%;
  border-radius: 3px;
  color: ${({ theme }) => theme.core.textColor};
  background: ${({ theme }) => theme.core.darkBackground};
`

const SearchResultItem = styled.div`
  padding: 6px 12px;

  &[aria-selected="true"] {
    background-color: ${({ theme }) => theme.core.backgroundHoverColor};
  }
`

const MissingInstrument = styled.div`
  padding: 6px 12px;
  font-size: 15px;
`

const SearchBox = forwardRef<HTMLInputElement>(function SearchBox(_, inputRef) {
  const instruments = useCreditInstrumentsByCusip()
  const [inputValue, setInputValue] = useState<string>("")

  const filteredInstruments = useMemo(() => {
    return Object.values(instruments).filter(
      (instrument) =>
        !inputValue ||
        instrument.cusip.toLowerCase().includes(inputValue.toLowerCase()) ||
        instrument.name.toLowerCase().includes(inputValue.toLowerCase()),
    )
  }, [inputValue, instruments])

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    getItemProps,
    openMenu,
  } = useCombobox({
    onInputValueChange({ inputValue }) {
      setInputValue(inputValue ?? "")
    },
    items: filteredInstruments,
    itemToString(instrument) {
      return instrument?.cusip ?? ""
    },
    inputValue,
    onSelectedItemChange: ({ selectedItem, type }) => {
      if (type !== useCombobox.stateChangeTypes.InputBlur) {
        setSelectedInstrumentId(selectedItem?.id ?? null)
      }
    },
    defaultHighlightedIndex: 0,
  })

  const renderItems = () => {
    if (filteredInstruments.length === 0) {
      return <MissingInstrument>No results found...</MissingInstrument>
    }
    return (
      <>
        {filteredInstruments.map((instrument, index) => (
          <SearchResultItem
            key={instrument.id}
            {...getItemProps({
              index,
              item: instrument,
            })}
            data-testid="search-result-item"
          >
            <InstrumentName>{instrument.name}</InstrumentName>
            <CusipWithBenchmark
              cusip={instrument.cusip}
              benchmark={instrument.benchmark}
            />
          </SearchResultItem>
        ))}
      </>
    )
  }

  return (
    <SearchWrapper {...getComboboxProps()}>
      <SearchInput
        {...getInputProps({
          placeholder: "Enter a CUSIP",
          onFocus: () => openMenu(),
          ref: inputRef,
        })}
      />
      <SearchResults {...getMenuProps()} data-testid="search-results">
        {isOpen && renderItems()}
      </SearchResults>
    </SearchWrapper>
  )
})
