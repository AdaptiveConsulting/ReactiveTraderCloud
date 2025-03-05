import styled, { ThemeProvider } from "styled-components"

import {
  SellSideRfqGrid,
  SellSideTradeTicket,
  useInvertedTheme,
  useRfqSearchParamEffect,
} from "@/client/App/Credit/SellSide"
import { DisconnectionOverlay } from "@/client/components/DisconnectionOverlay"

import { GlobalStyle } from "../theme"

const SellSideWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`

const SellSidePage = () => {
  const invertedTheme = useInvertedTheme()

  useRfqSearchParamEffect()

  return (
    <ThemeProvider theme={invertedTheme}>
      <DisconnectionOverlay />
      <GlobalStyle />
      <SellSideWrapper>
        <SellSideRfqGrid />
        <SellSideTradeTicket />
      </SellSideWrapper>
    </ThemeProvider>
  )
}
export default SellSidePage
