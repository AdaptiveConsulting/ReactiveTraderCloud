import styled from "styled-components"
import { Subscribe } from "@react-rxjs/core"
import { Loader } from "@/components/Loader"
import { TradesGrid } from "./TradesGrid"
import { TradesFooter } from "./TradesFooter"
import { TradesHeader } from "./TradesHeader"
import { tableTrades$ } from "./TradesState"
import { createSuspenseOnStale } from "@/utils/createSuspenseOnStale"
import { isBlotterDataStale$ } from "@/services/trades"
import { useEffect, useRef, useState } from "react"

const TradesStyle = styled.div`
  height: 100%;
  width: 100%;
  color: ${({ theme }) => theme.core.textColor};
  font-size: 0.8125rem;
`

const SuspenseOnStaleData = createSuspenseOnStale(isBlotterDataStale$)
const Trades: React.FC = () => {
  const ref = useRef(null)
  const [height, setHeight] = useState()

  useEffect(() => {
    if (ref.current) {
      //@ts-ignore
      setHeight(ref.current.offsetHeight)
    }
    console.log(height)
  }, [ref])

  return (
    <Subscribe
      source$={tableTrades$}
      fallback={<Loader ariaLabel="Loading trades blotter" />}
    >
      <SuspenseOnStaleData />
      <TradesStyle
        ref={ref}
        role="region"
        aria-labelledby="trades-table-heading"
      >
        <TradesHeader />
        <TradesGrid />
        <TradesFooter />
      </TradesStyle>
    </Subscribe>
  )
}

export default Trades
