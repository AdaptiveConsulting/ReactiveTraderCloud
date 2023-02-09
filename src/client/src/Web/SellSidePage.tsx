import styled, { ThemeProvider } from "styled-components"
import { GlobalScrollbarStyle } from "@/theme"
import { DisconnectionOverlay } from "@/components/DisconnectionOverlay"
import {
  SellSideRfqGrid,
  SellSideTradeTicket,
  useInvertedTheme,
  useRfqSearchParamEffect,
} from "@/App/Credit/SellSide"

const SellSideWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  background-color: ${({ theme }) => theme.primary[2]};
`

const SellSidePage = () => {
  const invertedTheme = useInvertedTheme()

  useRfqSearchParamEffect()

  return (
    <ThemeProvider theme={invertedTheme}>
      <DisconnectionOverlay />
      <GlobalScrollbarStyle />
      <SellSideWrapper>
        <SellSideRfqGrid />
        <SellSideTradeTicket />
      </SellSideWrapper>
    </ThemeProvider>
  )
}
export default SellSidePage
