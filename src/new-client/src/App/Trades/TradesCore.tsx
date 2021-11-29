import styled from "styled-components"
import { Subscribe } from "@react-rxjs/core"
import { Loader } from "@/components/Loader"
import { TradesGrid } from "./TradesGrid"
import { TradesFooter } from "./TradesFooter"
import { TradesHeader } from "./TradesHeader"
import { tableTrades$ } from "./TradesState"
import { createSuspenseOnStale } from "@/utils/createSuspenseOnStale"
import { isBlotterDataStale$ } from "@/services/trades"
import { useCallback, useEffect, useRef, useState } from "react"

const TradesStyle = styled.div`
  height: 100%;
  width: 100%;
  color: ${({ theme }) => theme.core.textColor};
  font-size: 0.8125rem;
  overflow-x: scroll;
  overflow-y: ;
`

const SuspenseOnStaleData = createSuspenseOnStale(isBlotterDataStale$)
const Trades: React.FC = () => {
  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)
  const ref = useCallback((node) => {
    if (node) {
      const resizeObserver = new ResizeObserver((entry) => {
        const { height, width } = entry[0].contentRect
        setHeight(height)
        setWidth(width)
      })
      resizeObserver.observe(node)
    }
  }, [])

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
        <TradesGrid height={height} width={width} />
      </TradesStyle>
    </Subscribe>
  )
}

export default Trades

//100vw
