import { useCreditInstrumentsByCusip } from "@/services/creditInstruments"
import { Subscribe } from "@react-rxjs/core"
import { FC, useState, useEffect, useRef } from "react"
import { FaSearch } from "react-icons/fa"
import styled from "styled-components"

const SearchWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1em 0;
  height: 2em;
`

const InputWrapper = styled.div`
  flex: 1 1 0;
`

interface Hideable {
  visible: boolean
}

const flexOrNone = (props: Hideable) => (props.visible ? "flex" : "none")

const CreditInstrument = styled.div<Hideable>`
  display: ${flexOrNone};
  flex-direction: column;
  justify-content: center;
`

const SearchInput = styled.input<Hideable>`
  display: ${flexOrNone};
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
  font-size: 11px;
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
  margin-left: 1em;
  height: 30px;
  flex: 0 0 30px;
  color: ${({ theme }) => theme.secondary[5]};

  &:hover {
    cursor: pointer;
    color: ${({ theme }) => theme.accents.primary.base};
  }
`

export const CreditInstrumentSearch: FC = () => {
  const [cusip, setCusip] = useState("")
  const [shouldShowInput, setShouldShowInput] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const instruments = useCreditInstrumentsByCusip()
  const instrumentName = cusip in instruments ? instruments[cusip].name : ""

  useEffect(() => {
    if (instrumentName || cusip.length === 9) {
      setShouldShowInput(false)
    }
  }, [instrumentName, cusip])

  useEffect(() => {
    if (cusip === "" && inputRef.current) {
      inputRef.current.focus()
    }
  }, [cusip])

  const showAndResetInput = () => {
    setShouldShowInput(true)
    setCusip("")
  }

  return (
    <Subscribe fallback={<div>Loading bonds</div>}>
      <SearchWrapper>
        <InputWrapper>
          <SearchInput
            visible={shouldShowInput}
            ref={inputRef}
            type="text"
            placeholder="CUSIP"
            value={cusip}
            onChange={(e) => setCusip(e.currentTarget.value)}
          />
          <CreditInstrument visible={!shouldShowInput}>
            {instrumentName ? (
              <>
                <InstrumentName>{instrumentName}</InstrumentName>
                <Cusip>{cusip}</Cusip>
              </>
            ) : (
              <MissingInstrument>No results found</MissingInstrument>
            )}
          </CreditInstrument>
        </InputWrapper>
        <IconWrapper>
          <FaSearch onClick={showAndResetInput} size="0.75em" />
        </IconWrapper>
      </SearchWrapper>
    </Subscribe>
  )
}
