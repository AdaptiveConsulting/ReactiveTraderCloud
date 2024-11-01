import { bind } from "@react-rxjs/core"
import { map } from "rxjs/operators"

import { supportsTearOut } from "@/client/App/TearOutSection/supportsTearOut"
import { TearOutComponent } from "@/client/App/TearOutSection/TearOutComponent"
import { TabBar, TabBarActionConfig } from "@/client/components/TabBar/TabBar"
import { currencyPairs$ } from "@/services/currencyPairs"
import { useIsLimitCheckerRunning } from "@/services/limitChecker/limitChecker"

import {
  ALL_CURRENCIES,
  onSelectCurrency,
  useSelectedCurrency,
} from "../selectedCurrency"
import {
  getInitView,
  onToggleSelectedView,
  TileView,
  useSelectedTileView,
} from "../selectedView"
import { LimitCheckerIndicator } from "./LimitCheckerIndicator"
import { ChartIcon } from "./ToggleView/ChartIcon"

const [useCurrencies, mainHeader$] = bind(
  currencyPairs$.pipe(
    map((currencyPairs) => [
      ...new Set(
        Object.values(currencyPairs).map((currencyPair) => currencyPair.base),
      ),
    ]),
  ),
)

export { mainHeader$ }

export const MainHeader = () => {
  const currencies = useCurrencies()
  const currency = useSelectedCurrency()
  const isLimitCheckerRunning = useIsLimitCheckerRunning()
  const tileView = useSelectedTileView(getInitView())

  const options = [ALL_CURRENCIES, ...currencies]
  const actions: TabBarActionConfig[] = [
    {
      name: "toggleTileView",
      inner: <ChartIcon />,
      active: tileView === TileView.Analytics,
      onClick: onToggleSelectedView,
      size: "sm",
    },
  ]

  if (supportsTearOut) {
    actions.push({
      name: "tearOut",
      inner: <TearOutComponent section="tiles" />,
      size: "sm",
    })
  }

  if (isLimitCheckerRunning) {
    actions.push({
      name: "limitChecker",
      inner: <LimitCheckerIndicator />,
      size: "sm",
    })
  }

  return (
    <TabBar
      items={options}
      handleItemOnClick={(item) => onSelectCurrency(item)}
      activeItem={currency}
      actions={actions}
    />
  )
}
