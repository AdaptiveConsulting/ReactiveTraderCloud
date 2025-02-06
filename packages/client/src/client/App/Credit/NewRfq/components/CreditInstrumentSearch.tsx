import { bind } from "@react-rxjs/core"
import { useCombobox } from "downshift"
import { forwardRef, useMemo, useState } from "react"
import { map, withLatestFrom } from "rxjs/operators"

import { TextInput } from "@/client/components/Form/TextInput"
import { SearchIcon } from "@/client/components/icons"
import { Typography } from "@/client/components/Typography"
import {
  creditInstrumentsByCusip$,
  useCreditInstrumentsByCusip,
} from "@/services/credit"

import { InstrumentDetails } from "../../common/InstrumentDetails"
import { instrumentId$, setInstrumentId } from "../state"
import {
  IconWrapper,
  InputWrapper,
  InstrumentSearchWrapper,
  SearchResultItem,
  SearchResultsWrapper,
  SearchWrapper,
} from "./styled"
import { useInputFocus } from "./useInputFocus"

export const [useSelectedInstrument] = bind(
  instrumentId$.pipe(
    withLatestFrom(creditInstrumentsByCusip$),
    map(([instrumentId, creditInstrumentsByCusip]) =>
      instrumentId !== null
        ? (Object.values(creditInstrumentsByCusip).find(
            (instrument) => instrument.id === instrumentId,
          ) ?? null)
        : null,
    ),
  ),
  null,
)

export const CreditInstrumentSearch = () => {
  const selectedInstrument = useSelectedInstrument()
  const { inputRef, focusInput } = useInputFocus()

  const showAndResetInput = () => {
    setInstrumentId(null)
    focusInput()
  }

  return (
    <InstrumentSearchWrapper>
      <InputWrapper>
        {selectedInstrument ? (
          <InstrumentDetails {...selectedInstrument} />
        ) : (
          <SearchBox onChange={setInstrumentId} ref={inputRef} />
        )}
      </InputWrapper>
      <IconWrapper onClick={showAndResetInput}>{SearchIcon}</IconWrapper>
    </InstrumentSearchWrapper>
  )
}

const SearchBox = forwardRef<
  HTMLInputElement,
  { onChange: (value: number | null) => void }
>(function SearchBox({ onChange }, inputRef) {
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
        onChange(selectedItem?.id ?? null)
      }
    },
    defaultHighlightedIndex: 0,
  })

  const renderItems = () => {
    if (!filteredInstruments.length) {
      return (
        <SearchResultItem>
          <Typography variant="Text md/Regular">No results found...</Typography>
        </SearchResultItem>
      )
    }
    return filteredInstruments.map((instrument, index) => (
      <SearchResultItem
        key={instrument.id}
        {...getItemProps({
          index,
          item: instrument,
        })}
        data-testid="search-result-item"
      >
        <InstrumentDetails {...instrument} />
      </SearchResultItem>
    ))
  }

  return (
    <SearchWrapper {...getComboboxProps()}>
      <TextInput
        placeholder={"Enter a CUSIP"}
        {...getInputProps({
          onFocus: () => openMenu(),
          ref: inputRef,
        })}
      />
      <SearchResultsWrapper {...getMenuProps()} data-testid="search-results">
        {isOpen && renderItems()}
      </SearchResultsWrapper>
    </SearchWrapper>
  )
})
