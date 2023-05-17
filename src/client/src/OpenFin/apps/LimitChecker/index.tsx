import { Route } from "react-router"

import { DisconnectionOverlay } from "@/components/DisconnectionOverlay"
import { DocTitle } from "@/components/DocTitle"
import { ROUTES_CONFIG } from "@/constants"

import { LimitChecker } from "./LimitChecker"

const LimitCheckerRoutes = () => (
  <>
    <Route
      path={ROUTES_CONFIG.limitChecker}
      render={() => (
        <DocTitle title="Limit Checker">
          <LimitChecker />
          <DisconnectionOverlay />
        </DocTitle>
      )}
    />
  </>
)

export default LimitCheckerRoutes
