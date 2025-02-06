import { bind } from "@react-rxjs/core"
import { map } from "rxjs/operators"

import { supportsTearOut } from "@/client/App/TearOutSection/supportsTearOut"
import { TearOutComponent } from "@/client/App/TearOutSection/TearOutComponent"
import { ChartIcon } from "@/client/components/icons"
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

export const LiveRatesHeader = () => {
  const currencies = useCurrencies()
  const currency = useSelectedCurrency()
  const isLimitCheckerRunning = useIsLimitCheckerRunning()
  const tileView = useSelectedTileView(getInitView())

  const options = [ALL_CURRENCIES, ...currencies]
  const actions: TabBarActionConfig = [
    {
      name: "toggleTileView",
      inner: ChartIcon,
      active: tileView === TileView.Analytics,
      onClick: onToggleSelectedView,
    },
  ]

  if (supportsTearOut) {
    actions.push({
      name: "tearOut",
      inner: <TearOutComponent section="tiles" />,
    })
  }

  if (isLimitCheckerRunning) {
    actions.push({
      name: "limitChecker",
      inner: <LimitCheckerIndicator />,
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
