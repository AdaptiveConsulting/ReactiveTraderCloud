import { memo } from "react"
import styled from "styled-components"

const InstrumentCusip = styled.div`
  font-size: 11px;
  font-weight: 500;
  opacity: 0.6;
`

interface CusipWithBenchmarkProps {
  cusip?: string
  benchmark?: string
}

export const CusipWithBenchmark = memo(
  // TODO: get benchmark from server
  ({ cusip, benchmark }: CusipWithBenchmarkProps) => {
    return (
      <InstrumentCusip>
        {cusip ?? "No cusip found"} &#160;&#x2022;&#160; 5Y UST 1.500 08/2026
      </InstrumentCusip>
    )
  },
)
