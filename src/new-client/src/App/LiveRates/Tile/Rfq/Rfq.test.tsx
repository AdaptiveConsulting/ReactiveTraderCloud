import * as notionalModule from "../Notional/Notional"
import * as rs from "./Rfq.state"
import { act, fireEvent, render, screen } from "@testing-library/react"
import { TestThemeProvider } from "@/utils/testUtils"
import { RfqButton } from "@/App/LiveRates/Tile/Rfq/RfqButton"

jest.mock("../Tile.context", () => ({
  ...(jest.requireActual("../Tile.context") as {}),
  useTileCurrencyPair: jest.fn().mockReturnValue("USD"),
}))

let useNotionalSpy: jest.SpyInstance
let rfqStateSpy: jest.SpyInstance
let isRfqSpy: jest.SpyInstance
let onQuoteRequestSpy: jest.SpyInstance
let onCancelRequest: jest.SpyInstance

const renderComponent = (isAnalytics = false) =>
  render(
    <TestThemeProvider>
      <RfqButton isAnalytics={isAnalytics} />
    </TestThemeProvider>,
  )

describe("RFQ/buttons", () => {
  beforeEach(() => {
    useNotionalSpy = jest.spyOn(notionalModule, "useNotional")
    rfqStateSpy = jest.spyOn(rs, "useRfqState")
    isRfqSpy = jest.spyOn(rs, "useIsRfq")
    onQuoteRequestSpy = jest.spyOn(rs, "onQuoteRequest")
    onCancelRequest = jest.spyOn(rs, "onCancelRfq")
  })

  it("should not display rfq button", () => {
    useNotionalSpy.mockReturnValue({ value: 1000, inputValue: "1,000" })
    isRfqSpy.mockReturnValue(false)
    rfqStateSpy.mockReturnValue({ stage: rs.QuoteStateStage.Init })
    renderComponent(false)

    expect(screen.queryByText("Initiate RFQ")).toBeNull()
    expect(screen.queryByText("Cancel RFQ")).toBeNull()
    expect(screen.queryByText("Requote")).toBeNull()
  })

  it("should display 'Initiate RFQ' and call the onClickHandler", () => {
    useNotionalSpy.mockReturnValue({ value: 1000, inputValue: "1,000" })
    isRfqSpy.mockReturnValue(true)
    rfqStateSpy.mockReturnValue({ stage: rs.QuoteStateStage.Init })
    renderComponent(false)

    const buttonText = "Initiate RFQ"
    expect(screen.queryByText(buttonText)).not.toBeNull()

    act(() => {
      fireEvent.click(screen.getByText(buttonText))
    })
    expect(onQuoteRequestSpy).toHaveBeenCalled()
  })

  it("should display 'Cancel RFQ'", () => {
    useNotionalSpy.mockReturnValue({ value: 1000, inputValue: "1,000" })
    isRfqSpy.mockReturnValue(true)
    rfqStateSpy.mockReturnValue({ stage: rs.QuoteStateStage.Requested })
    renderComponent(false)

    const buttonText = "Cancel RFQ"
    expect(screen.queryByText(buttonText)).not.toBeNull()

    act(() => {
      fireEvent.click(screen.getByText(buttonText))
    })
    expect(onCancelRequest).toHaveBeenCalled()
  })

  it("should display 'Requote'", () => {
    useNotionalSpy.mockReturnValue({ value: 1000, inputValue: "1,000" })
    isRfqSpy.mockReturnValue(true)
    rfqStateSpy.mockReturnValue({ stage: rs.QuoteStateStage.Rejected })
    renderComponent(false)

    const buttonText = "Requote"
    expect(screen.queryByText(buttonText)).not.toBeNull()

    act(() => {
      fireEvent.click(screen.getByText(buttonText))
    })
    expect(onQuoteRequestSpy).toHaveBeenCalled()
  })

  it("should disable the button when the notional exceeds max value", () => {
    useNotionalSpy.mockReturnValue({
      value: 1_000_000_001,
      inputValue: "1,000,000,001",
    })
    isRfqSpy.mockReturnValue(true)
    rfqStateSpy.mockReturnValue({ stage: rs.QuoteStateStage.Init })
    renderComponent(false)

    expect(
      screen.queryByText("Initiate RFQ")?.hasAttribute("disabled"),
    ).toEqual(true)
  })
})
