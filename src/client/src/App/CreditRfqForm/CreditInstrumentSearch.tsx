import { useCreditInstrumentsByCusip } from "@/services/creditInstruments"
import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { FC, useState, useEffect, useRef } from "react"
import { FaSearch } from "react-icons/fa"
import styled from "styled-components"

const SearchWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 2em;
`

const InputWrapper = styled.div`
  flex: 1 1 0;
`

interface Hideable {
  visible: boolean
}

const CreditInstrument = styled.div<Hideable>`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const SearchInput = styled.input<Hideable>`
  display: flex;
  color: ${({ theme }) => theme.core.textColor};
  padding: 6px;
  width: 100%;
  border-radius: 3px;
  border: 1px solid ${({ theme }) => theme.core.dividerColor};
  outline: none;

  &:focus {
    outline: none !important;
    border-color: ${({ theme }) => theme.accents.primary.base};
  }
`

const InstrumentName = styled.div`
  font-size: 15px;
`

const Cusip = styled.div`
  font-size: 12px;
  opacity: 60%;
`

const MissingInstrument = styled.div`
  font-size: 15px;
  color: ${({ theme }) => theme.accents.negative.base};
`

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
  height: 30px;
  flex: 0 0 30px;
  color: ${({ theme }) => theme.secondary[5]};

  &:hover {
    cursor: pointer;
    color: ${({ theme }) => theme.accents.primary.base};
  }
`

const [selectedInstrument$, setSelectedInstrument] = createSignal<string>()
const [useSelectedInstrument] = bind(selectedInstrument$, "")

export const CreditInstrumentSearch: FC = () => {
  const [cusip, setCusip] = useState("")
  const [showInput, setShowInput] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const instruments = useCreditInstrumentsByCusip()
  const selectedInstrument = useSelectedInstrument()

  useEffect(() => {
    if (cusip === "" && inputRef.current) {
      inputRef.current.focus()
    }
  }, [cusip])

  useEffect(() => {
    if (cusip === "") {
      setSelectedInstrument("")
    } else if (cusip in instruments) {
      setShowInput(false)
      setSelectedInstrument(cusip)
    } else if (cusip.length >= 9) {
      setShowInput(false)
    }
  }, [cusip, instruments])

  const showAndResetInput = () => {
    setShowInput(true)
    setCusip("")
  }

  return (
    <SearchWrapper>
      <InputWrapper>
        {showInput ? (
          <SearchInput
            visible={showInput}
            ref={inputRef}
            type="text"
            placeholder="Enter a CUSIP"
            value={cusip}
            onChange={(e) => setCusip(e.currentTarget.value)}
          />
        ) : (
          <CreditInstrument visible={!showInput}>
            {selectedInstrument ? (
              <>
                <InstrumentName>
                  {instruments[selectedInstrument].name}
                </InstrumentName>
                <Cusip>{selectedInstrument}</Cusip>
              </>
            ) : (
              <MissingInstrument>No results found</MissingInstrument>
            )}
          </CreditInstrument>
        )}
      </InputWrapper>
      <IconWrapper>
        <FaSearch onClick={showAndResetInput} size="0.75em" />
      </IconWrapper>
    </SearchWrapper>
  )
}
