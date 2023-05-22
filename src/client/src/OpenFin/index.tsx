import { lazy, Suspense } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import { Loader } from "@/components/Loader"
import { BASE_PATH, ROUTES_CONFIG } from "@/constants"
import { OpenFinContactDisplay } from "@/OpenFin/Footer/ContactUsButton"

import { Snapshots } from "./Snapshots/Snapshots"
import { ChildWindowFrame } from "./Window/ChildWindowFrame"
import { WindowFrame } from "./Window/WindowFrame"

const LauncherRoutes = lazy(() => import("@/OpenFin/apps/Launcher"))
const FxRoutes = lazy(() => import("@/OpenFin/apps/FX"))
const CreditRoutes = lazy(() => import("@/OpenFin/apps/Credit"))

export const OpenFinApp = () => (
  <BrowserRouter basename={BASE_PATH}>
    <Routes>
      <Route
        path={`${ROUTES_CONFIG.launcher}*`}
        element={
          <Suspense fallback={<Loader />}>
            <LauncherRoutes />
          </Suspense>
        }
      />
      <Route
        path={`${ROUTES_CONFIG.fx}*`}
        element={
          <Suspense fallback={<Loader />}>
            <FxRoutes />
          </Suspense>
        }
      />
      <Route
        path={`${ROUTES_CONFIG.credit}*`}
        element={
          <Suspense fallback={<Loader />}>
            <CreditRoutes />
          </Suspense>
        }
      />
      <Route path={ROUTES_CONFIG.contact} element={<OpenFinContactDisplay />} />
      <Route path="/openfin-window-frame" element={<WindowFrame />} />
      <Route path="/openfin-sub-window-frame" element={<ChildWindowFrame />} />
      <Route path={ROUTES_CONFIG.status} element={<div />} />
      <Route path="/snapshots" element={<Snapshots />} />
    </Routes>
  </BrowserRouter>
)
