import { CreditRfqForm, CreditRfqs } from "@/App/Credit"
import { CreditTrades } from "@/App/Trades"
import { DisconnectionOverlay } from "@/components/DisconnectionOverlay"
import { DocTitle } from "@/components/DocTitle"
import { ROUTES_CONFIG } from "@/constants"
import MainSellSideRoute from "@/Web/MainSellSideRoute"
import { Route } from "react-router-dom"

const CreditRoutes = () => (
  <>
    <Route
      path={ROUTES_CONFIG.creditRfqs}
      element={
        <DocTitle title="RFQs">
          <DisconnectionOverlay />
          <CreditRfqs />
        </DocTitle>
      }
    />
    <Route
      path={ROUTES_CONFIG.creditBlotter}
      element={
        <DocTitle title="Trades">
          <DisconnectionOverlay />
          <CreditTrades />
        </DocTitle>
      }
    />

    <Route
      path={ROUTES_CONFIG.newRfq}
      element={
        <DocTitle title="New RFQ">
          <DisconnectionOverlay />
          <CreditRfqForm />
        </DocTitle>
      }
    />
    <Route
      path={ROUTES_CONFIG.sellSide}
      element={
        <DocTitle title="Adaptive Bank RFQ Queue">
          <DisconnectionOverlay />
          <MainSellSideRoute />
        </DocTitle>
      }
    />
  </>
)

export default CreditRoutes
