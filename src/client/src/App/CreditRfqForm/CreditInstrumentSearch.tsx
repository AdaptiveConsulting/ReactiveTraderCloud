import { useCreditInstrumentsByCusip } from "@/services/creditInstruments"
import { Subscribe } from "@react-rxjs/core"
import { prependOnceListener } from "process"
import { FC, useState, useEffect, useRef } from "react"
import { FaSearch } from "react-icons/fa"
import styled from "styled-components"

const SearchWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1em;
  height: 2em;
`

interface Hideable {
  visible: boolean
}

const blockOrNone = (props: Hideable) => (props.visible ? "block" : "none")

const CreditInstrument = styled.div<Hideable>`
  display: ${blockOrNone};
`

const SearchInput = styled.input<Hideable>`
  display: ${blockOrNone};
  color: ${(props) => props.theme.core.textColor};
  width: 15em;
  padding: 6px;
  height: 100%;
  border-radius: 2px;
  border: 1px solid ${(props) => props.theme.core.dividerColor};
`

const InstrumentName = styled.div`
  font-size: 15px;
`

const Cusip = styled.div`
  font-size: 11px;
  color: ${(props) => props.theme.secondary[4]};
`

const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const CreditInstrumentSearch: FC = () => {
  const [cusip, setCusip] = useState("")
  const [shouldShowInput, setShouldShowInput] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const instruments = useCreditInstrumentsByCusip()
  const instrumentName = cusip in instruments ? instruments[cusip].name : ""

  useEffect(() => {
    if (instrumentName) {
      setShouldShowInput(false)
    }
  }, [instrumentName])

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
        <div>
          <SearchInput
            visible={shouldShowInput}
            ref={inputRef}
            type="text"
            placeholder="CUSIP"
            value={cusip}
            onChange={(e) => setCusip(e.currentTarget.value)}
          />
          <CreditInstrument visible={!shouldShowInput}>
            <InstrumentName>{instrumentName}</InstrumentName>
            <Cusip>{cusip}</Cusip>
          </CreditInstrument>
        </div>
        <IconWrapper>
          <FaSearch onClick={showAndResetInput} size="0.75em" />
        </IconWrapper>
      </SearchWrapper>
    </Subscribe>
  )
}
