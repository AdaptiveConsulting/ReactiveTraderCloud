import { Route, Routes } from "react-router"

import { DisconnectionOverlay } from "@/components/DisconnectionOverlay"
import { DocTitle } from "@/components/DocTitle"
import { ROUTES_CONFIG } from "@/constants"

import { LimitChecker } from "./LimitChecker"

const LimitCheckerRoutes = () => (
  <Routes>
    <Route
      path={ROUTES_CONFIG.limitChecker}
      element={
        <DocTitle title="Limit Checker">
          <LimitChecker />
          <DisconnectionOverlay />
        </DocTitle>
      }
    />
  </Routes>
)

export default LimitCheckerRoutes
