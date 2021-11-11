import {
  Header,
  LeftNav,
  LeftNavItemFirst,
  NavItem,
  RightNav,
  LeftNavTitle,
  HeaderAction,
} from "../styled"
import {
  useSelectedCurrency,
  AllCurrencies,
  ALL_CURRENCIES,
  onSelectCurrency,
} from "../selectedCurrency"
import { ToggleView } from "./ToggleView"
import { CurrencyOptions } from "./CurrencyOptions"
import { currencyPairs$ } from "@/services/currencyPairs"
import { bind } from "@react-rxjs/core"
import { map } from "rxjs/operators"

import { PopOutIcon } from "@/components/icons/PopOutIcon"
import { tearOutTiles, tearOutEntryTiles$ } from "@/Web/tearoutSections"
import { useObservableSubscription } from "@/utils/useObservableSubscription"
import { openWindow } from "@/Web/utils/window"
import { constructUrl } from "@/utils/url"
import {
  useTearOutTradeState,
  useTearOutAnalyticsState,
} from "@/Web/tearoutSections"

const [useCurrencies, mainHeader$] = bind(
  currencyPairs$.pipe(
    map((currencyPairs) => [
      ...new Set(
        Object.values(currencyPairs).map((currencyPair) => currencyPair.base),
      ),
    ]),
  ),
)

var isTornOut = false
export { mainHeader$ }
export const MainHeader: React.FC = () => {
  const tearOutTradeState = useTearOutTradeState("Trade")
  const tearOutAnalyticsState = useTearOutAnalyticsState("Analytics")

  useObservableSubscription(
    tearOutEntryTiles$.subscribe(async ([tornOut]) => {
      if (tornOut && !isTornOut) {
        isTornOut = true
        openWindow(
          {
            url: constructUrl("/tiles"),
            width: window.innerWidth * 0.85,
            name: "",
            height: window.innerHeight * 0.65,
          },
          () => {
            isTornOut = false
            tearOutTiles(false)
          },
        )
      }
    }),
  )

  const currencies = useCurrencies()
  const currency = useSelectedCurrency()

  const options = [ALL_CURRENCIES as AllCurrencies, ...currencies]

  return (
    <Header>
      <LeftNav>
        <LeftNavItemFirst>Live Rates</LeftNavItemFirst>
        {options.map((currencyOption) => (
          <NavItem
            data-testid={`menuButton-${currencyOption.toString()}`}
            key={currencyOption.toString()}
            active={currencyOption === currency}
            data-qa="workspace-header__nav-item"
            data-qa-id={`currency-option-${currencyOption
              .toString()
              .toLowerCase()}`}
            onClick={() => onSelectCurrency(currencyOption)}
          >
            {currencyOption === ALL_CURRENCIES ? "ALL" : currencyOption}
          </NavItem>
        ))}
      </LeftNav>
      <LeftNavTitle>Live Rates</LeftNavTitle>
      <RightNav>
        <CurrencyOptions
          options={options}
          onSelectionChange={onSelectCurrency}
        />
        <ToggleView />
        {!isTornOut && !(tearOutTradeState && tearOutAnalyticsState) && (
          <HeaderAction onClick={() => tearOutTiles(true)}>
            <PopOutIcon />
          </HeaderAction>
        )}
      </RightNav>
    </Header>
  )
}
