import Resizer from "@/components/Resizer"
import styled from "styled-components"
import Header from "@/App/Header"
import { Footer } from "@/App/Footer"
import { Trades } from "@/App/Trades"
import { Analytics } from "@/App/Analytics"
import { DisconnectionOverlay } from "@/App/DisconnectionOverlay"
import { LiveRates } from "@/App/LiveRates"
import { useEffect } from "react"

import {
  useTearOutSectionEntry,
  useTearOutTileState$,
} from "@/Web/TearOutSection/state"

import { handleTearOutSection } from "@/Web/TearOutSection/handleTearOutSection"

const Wrapper = styled("div")`
  width: 100%;
  background-color: ${({ theme }) => theme.core.darkBackground};
  overflow: hidden;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
`
const AppLayoutRoot = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  max-height: 100vh;
  overflow: hidden;

  display: grid;
  grid-template-rows: auto 1fr auto;
  background-color: ${({ theme }) => theme.core.darkBackground};
  color: ${({ theme }) => theme.core.textColor};
`

const MainWrapper = styled.div`
  display: flex;
  width: 100%;
  overflow: hidden;
`

export const MainRoute: React.FC = () => {
  const tearOutTileState = useTearOutTileState$("liverates")
  const tearOutAnalyticsState = useTearOutTileState$("analytics")
  const tearOutTradeState = useTearOutTileState$("trades")

  useEffect(() => {
    console.log("tile", tearOutTileState)
  }, [tearOutTileState])

  const tearOutEntry = useTearOutSectionEntry()

  useEffect(() => {
    if (tearOutEntry) {
      const [tornOut, section] = tearOutEntry
      if (tornOut) {
        handleTearOutSection(section)
      }
    }
  }, [tearOutEntry])

  return (
    <Wrapper>
      <DisconnectionOverlay />
      <AppLayoutRoot data-qa="app-layout__root">
        <Header />
        <MainWrapper>
          <Resizer defaultHeight={30}>
            {!tearOutTileState && <LiveRates />}
            {!tearOutTradeState && <Trades />}
          </Resizer>
          {!tearOutAnalyticsState && <Analytics />}
        </MainWrapper>
        <Footer />
      </AppLayoutRoot>
    </Wrapper>
  )
}
