export const setupWindow = () => {
  const originalOffsetHeight = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    "offsetHeight",
  )
  const originalOffsetWidth = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    "offsetWidth",
  )

  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
      configurable: true,
      value: 50,
    })
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      value: 50,
    })
  })

  afterAll(() => {
    Object.defineProperty(
      HTMLElement.prototype,
      "offsetHeight",
      originalOffsetHeight as PropertyDescriptor,
    )
    Object.defineProperty(
      HTMLElement.prototype,
      "offsetWidth",
      originalOffsetWidth as PropertyDescriptor,
    )
  })
}
