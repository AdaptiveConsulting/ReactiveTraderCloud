import { lazy, Suspense } from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { Snapshots } from "./Snapshots/Snapshots"
import { ChildWindowFrame } from "./Window/ChildWindowFrame"
import { WindowFrame } from "./Window/WindowFrame"
import { OpenFinContactDisplay } from "@/OpenFin/Footer/ContactUsButton"
import { BASE_PATH, ROUTES_CONFIG } from "@/constants"
import { Loader } from "@/components/Loader"

const LauncherRoutes = lazy(() => import("@/OpenFin/apps/Launcher"))
const FxRoutes = lazy(() => import("@/OpenFin/apps/FX"))
const CreditRoutes = lazy(() => import("@/OpenFin/apps/Credit"))

export const OpenFinApp = () => (
  <BrowserRouter basename={BASE_PATH}>
    <Switch>
      <Route path={`${ROUTES_CONFIG.launcher}*`}>
        <Suspense fallback={<Loader />}>
          <LauncherRoutes />
        </Suspense>
      </Route>
      <Route path={`${ROUTES_CONFIG.fx}*`}>
        <Suspense fallback={<Loader />}>
          <FxRoutes />
        </Suspense>
      </Route>
      <Route path={`${ROUTES_CONFIG.credit}*`}>
        <Suspense fallback={<Loader />}>
          <CreditRoutes />
        </Suspense>
      </Route>
      <Route
        path={ROUTES_CONFIG.contact}
        render={() => <OpenFinContactDisplay />}
      />
      <Route path="/openfin-window-frame" render={() => <WindowFrame />} />
      <Route
        path="/openfin-sub-window-frame"
        render={() => <ChildWindowFrame />}
      />
      <Route path={ROUTES_CONFIG.status} render={() => <div />} />
      <Route path="/snapshots" render={() => <Snapshots />} />
    </Switch>
  </BrowserRouter>
)
