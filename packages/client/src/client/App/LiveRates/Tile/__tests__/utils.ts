import { screen, within } from "@testing-library/react"

const successStats = {
  "You Sold": "EUR 10,000,000",
  Rate: "1.53816",
  Cost: "USD 15,381,600",
  Settlement: "(Spt) 04 Feb",
}

export const assertSuccessOverlay = (
  overrides?: Partial<typeof successStats>,
) => {
  Object.entries({ ...successStats, ...overrides }).forEach(([name, value]) =>
    expect(
      within(screen.getByRole("alert")).getByText(name).nextSibling
        ?.textContent,
    ).toEqual(value),
  )
}
