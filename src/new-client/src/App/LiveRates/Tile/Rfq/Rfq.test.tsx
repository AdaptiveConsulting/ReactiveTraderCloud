import * as rs from "./Rfq.state"
import { act, fireEvent, render, screen } from "@testing-library/react"
import { TestThemeProvider } from "@/utils/testUtils"
import { RfqButton } from "@/App/LiveRates/Tile/Rfq/RfqButton"

jest.mock("../Tile.context", () => ({
  ...(jest.requireActual("../Tile.context") as {}),
  useTileCurrencyPair: jest.fn().mockReturnValue("USD"),
}))

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
    rfqStateSpy = jest.spyOn(rs, "useRfqState")
    isRfqSpy = jest.spyOn(rs, "useIsRfq")
    onQuoteRequestSpy = jest.spyOn(rs, "onQuoteRequest")
    onCancelRequest = jest.spyOn(rs, "onCancelRequest")
  })

  it("should not display rfq button", () => {
    isRfqSpy.mockReturnValue(false)
    rfqStateSpy.mockReturnValue({ state: rs.QuoteState.Init })
    renderComponent(false)

    expect(screen.queryByText("Initiate RFQ")).toBeNull()
    expect(screen.queryByText("Cancel RFQ")).toBeNull()
    expect(screen.queryByText("Requote")).toBeNull()
  })

  it("should display 'Initiate RFQ' and call the onClickHandler", () => {
    isRfqSpy.mockReturnValue(true)
    rfqStateSpy.mockReturnValue({ state: rs.QuoteState.Init })
    renderComponent(false)

    const buttonText = "Initiate RFQ"
    expect(screen.queryByText(buttonText)).not.toBeNull()

    act(() => {
      fireEvent.click(screen.getByText(buttonText))
    })
    expect(onQuoteRequestSpy).toHaveBeenCalled()
  })

  it("should display 'Cancel RFQ'", () => {
    isRfqSpy.mockReturnValue(true)
    rfqStateSpy.mockReturnValue({ state: rs.QuoteState.Requested })
    renderComponent(false)

    const buttonText = "Cancel RFQ"
    expect(screen.queryByText(buttonText)).not.toBeNull()

    act(() => {
      fireEvent.click(screen.getByText(buttonText))
    })
    expect(onCancelRequest).toHaveBeenCalled()
  })

  it("should display 'Requote'", () => {
    isRfqSpy.mockReturnValue(true)
    rfqStateSpy.mockReturnValue({ state: rs.QuoteState.Rejected })
    renderComponent(false)

    const buttonText = "Requote"
    expect(screen.queryByText(buttonText)).not.toBeNull()

    act(() => {
      fireEvent.click(screen.getByText(buttonText))
    })
    expect(onQuoteRequestSpy).toHaveBeenCalled()
  })
})
