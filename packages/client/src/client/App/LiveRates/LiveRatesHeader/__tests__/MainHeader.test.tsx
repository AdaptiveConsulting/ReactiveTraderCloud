import { Subscribe } from "@react-rxjs/core"
import {
  act,
  fireEvent,
  getByText,
  render,
  screen,
} from "@testing-library/react"
import { BehaviorSubject } from "rxjs"

import { TestThemeProvider } from "@/client/utils/testUtils"
import { CurrencyPair } from "@/services/currencyPairs"
import { ccppMock } from "@/services/currencyPairs/__mocks__/_ccpp"

import { liveRates$ } from "../../LiveRatesCore"
import { Tiles } from "../../Tiles"
import { LiveRatesHeader } from ".."

vi.mock("@/services/currencyPairs/currencyPairs")
vi.mock("../../Tile/Tile.tsx")

const currencyPairMock1: CurrencyPair = {
  symbol: "EURUSD",
  base: "EUR",
  terms: "USD",
  ratePrecision: 5,
  pipsPosition: 4,
  defaultNotional: 1_000_000,
}

const currencyPairMock2: CurrencyPair = {
  symbol: "GBPJPY",
  base: "GBP",
  terms: "JPY",
  ratePrecision: 5,
  pipsPosition: 2,
  defaultNotional: 1_000_000,
}

const renderComponent = async () =>
  await act(async () =>
    render(
      <TestThemeProvider>
        <Subscribe source$={liveRates$} fallback="No data">
          <LiveRatesHeader />
          <Tiles />
        </Subscribe>
      </TestThemeProvider>,
    ),
  )

describe("MainHeader", () => {
  beforeEach(() => {
    ccppMock.__resetMock()
    ccppMock.__setMock(
      new BehaviorSubject({
        [currencyPairMock1.symbol]: currencyPairMock1,
        [currencyPairMock2.symbol]: currencyPairMock2,
      }),
    )
  })

  it("should load all the currency buttons", async () => {
    await renderComponent()

    const currencyTabBar = screen.getByTestId("tab-bar-tabs")
    expect(getByText(currencyTabBar, "All")).not.toBeNull()
    expect(getByText(currencyTabBar, "EUR")).not.toBeNull()
    expect(getByText(currencyTabBar, "GBP")).not.toBeNull()
  })

  it("should filter the tiles based on selection", async () => {
    await renderComponent()

    expect(
      screen.getByRole("region", { name: "Lives Rates Tiles" }).children.length,
    ).toBe(2)

    const currencyTabBar = screen.getByTestId("tab-bar-tabs")

    act(() => {
      fireEvent.click(getByText(currencyTabBar, "EUR"))
    })

    expect(
      screen.getByRole("region", { name: "Lives Rates Tiles" }).children.length,
    ).toBe(1)
    expect(screen.getByTestId("tile-EURUSD")).not.toBeNull()

    act(() => {
      fireEvent.click(getByText(currencyTabBar, "GBP"))
    })

    expect(
      screen.getByRole("region", { name: "Lives Rates Tiles" }).children.length,
    ).toBe(1)
    expect(screen.getByTestId("tile-GBPJPY")).not.toBeNull()
  })

  it("should show the charts in tiles once click toggle view button", async () => {
    await renderComponent()

    expect(screen.getByTestId("tile-EURUSD").textContent).toBe(
      "ShowingChart: true",
    )

    act(() => {
      fireEvent.click(screen.getByTestId("action-toggleTileView"))
    })

    expect(screen.getByTestId("tile-EURUSD").textContent).toBe(
      "ShowingChart: false",
    )

    act(() => {
      fireEvent.click(screen.getByTestId("action-toggleTileView"))
    })

    expect(screen.getByTestId("tile-EURUSD").textContent).toBe(
      "ShowingChart: true",
    )
  })
})
