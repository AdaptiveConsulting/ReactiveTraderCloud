import { BASE_PATH } from "@/constants"
import { MainRoute } from "./MainRoute"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { ChildWindowFrame } from "@/OpenFin/Window/ChildWindowFrame"

export const LauncherApp = () => (
  <BrowserRouter basename={BASE_PATH}>
    <Switch>
      <Route
        path="/openfin-sub-window-frame"
        exact
        render={() => <ChildWindowFrame />}
      />
      <Route path="/" render={() => <MainRoute />} />
    </Switch>
  </BrowserRouter>
)
