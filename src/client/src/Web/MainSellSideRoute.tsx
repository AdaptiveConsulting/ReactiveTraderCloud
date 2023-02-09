import { SellSideRfqGrid, SellSideTradeTicket } from "@/App/SellSide"
import { useInvertedTheme } from "@/App/SellSide/utils"
import { useRfqSearchParamEffect } from "@/App/SellSide/window"
import { DisconnectionOverlay } from "@/components/DisconnectionOverlay"
import { GlobalScrollbarStyle } from "@/theme"
import styled, { ThemeProvider } from "styled-components"

const SellSideWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  background-color: ${({ theme }) => theme.primary[2]};
`

const MainSellSideRoute = () => {
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
export default MainSellSideRoute
