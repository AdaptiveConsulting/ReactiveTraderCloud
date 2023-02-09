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
      exact
      path={ROUTES_CONFIG.creditRfqs}
      render={() => (
        <DocTitle title="RFQs">
          <DisconnectionOverlay />
          <CreditRfqs />
        </DocTitle>
      )}
    />
    <Route
      exact
      path={ROUTES_CONFIG.creditBlotter}
      render={() => (
        <DocTitle title="Trades">
          <DisconnectionOverlay />
          <CreditTrades />
        </DocTitle>
      )}
    />

    <Route
      exact
      path={ROUTES_CONFIG.newRfq}
      render={() => (
        <DocTitle title="New RFQ">
          <DisconnectionOverlay />
          <CreditRfqForm />
        </DocTitle>
      )}
    />
    <Route
      exact
      path={ROUTES_CONFIG.sellSide}
      render={() => (
        <DocTitle title="Adaptive Bank RFQ Queue">
          <DisconnectionOverlay />
          <MainSellSideRoute />
        </DocTitle>
      )}
    />
  </>
)

export default CreditRoutes
