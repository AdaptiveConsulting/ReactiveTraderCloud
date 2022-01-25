import {
  formatAsWholeNumber,
  formatNumber,
  formatWithScale,
  precisionNumberFormatter,
  significantDigitsNumberFormatter,
  customNumberFormatter,
  getThousandsSeparator,
  getDecimalSeparator,
} from "../formatNumber"

describe("all number formatters", () => {
  it("should round when truncating", () => {
    const input = 0.6789
    const expectedOutput = "1"
    expect(formatAsWholeNumber(input)).toBe(expectedOutput)

    const input2 = 5.6789
    const expectedOutput2 = "5.679"
    expect(formatNumber(input2)).toBe(expectedOutput2)

    const format = precisionNumberFormatter(2)
    const input3 = 5.6789
    const expectedOutput3 = "5.68"
    expect(format(input3)).toBe(expectedOutput3)
  })
})

describe("formatWholeNumber", () => {
  it("should truncate decimals", () => {
    const input = 123.456789
    const expectedOutput = "123"
    expect(formatAsWholeNumber(input)).toBe(expectedOutput)
  })
})

describe("formatNumber", () => {
  it("should format to maximum of 3 digits of precision", () => {
    const input = 123.456789
    const expectedOutput = "123.457"
    expect(formatNumber(input)).toBe(expectedOutput)
  })

  it("should display no minimum precision", () => {
    const input = 123.4
    const expectedOutput = "123.4"
    expect(formatNumber(input)).toBe(expectedOutput)
  })
})

describe("significantDigitsNumberFormatter", () => {
  const formatTo6SignificantDigits = significantDigitsNumberFormatter(6)

  it("format decimals to same number of digits regardless of base", () => {
    const input = 123.456789
    const expectedOutput = "123.457"
    expect(formatTo6SignificantDigits(input)).toBe(expectedOutput)

    const input2 = 1.23456789
    const expectedOutput2 = "1.23457"
    expect(formatTo6SignificantDigits(input2)).toBe(expectedOutput2)
  })

  it("should replace extra significant digits with 0s for large numbers", () => {
    const input = 123456789
    const expectedOutput = "123,457,000"
    expect(formatTo6SignificantDigits(input)).toBe(expectedOutput)
  })

  it("should add trailing 0s when given too few digits", () => {
    const input = 123.4
    const expectedOutput = "123.400"
    expect(formatTo6SignificantDigits(input)).toBe(expectedOutput)
  })

  it("should not treat leading 0 as a significant digit", () => {
    const input = 0.123456789
    const expectedOutput = "0.123457"
    expect(formatTo6SignificantDigits(input)).toBe(expectedOutput)
  })
})

describe("precisionNumberFormatter", () => {
  const formatToPrecision2 = precisionNumberFormatter(2)

  it("truncate to same number of decimals regardless of base or fraction", () => {
    const input = 123.456789
    const expectedOutput = "123.46"
    expect(formatToPrecision2(input)).toBe(expectedOutput)

    const input2 = 1.23456789
    const expectedOutput2 = "1.23"
    expect(formatToPrecision2(input2)).toBe(expectedOutput2)

    const input3 = 123_456_789
    const expectedOutput3 = "123,456,789.00"
    expect(formatToPrecision2(input3)).toBe(expectedOutput3)
  })
})

describe("customNumberFormatter", () => {
  it("should take arbitrary Intl.NumberFormat options", () => {
    const format = customNumberFormatter({
      minimumIntegerDigits: 3,
    })

    const input = 1
    const expectedOutput = "001"

    expect(format(input)).toBe(expectedOutput)
  })
})

describe("formatWithScale", () => {
  const formatToPrecision1 = precisionNumberFormatter(1)

  it("should scale numbers in K", () => {
    const input = 1_234
    const expectedOutput = "1.2k"
    expect(formatWithScale(input, formatToPrecision1)).toBe(expectedOutput)
  })

  it("should scale numbers in M", () => {
    const input = 12_345_678
    const expectedOutput = "12.3m"
    expect(formatWithScale(input, formatToPrecision1)).toBe(expectedOutput)
  })

  it("should scale numbers in B", () => {
    const input = 123_456_789_012
    const expectedOutput = "123.5b"
    expect(formatWithScale(input, formatToPrecision1)).toBe(expectedOutput)
  })

  it("should scale numbers in T", () => {
    const input = 1_234_567_890_123.456
    const expectedOutput = "1.2t"
    expect(formatWithScale(input, formatToPrecision1)).toBe(expectedOutput)
  })

  it("should not scale beyond T", () => {
    const input = 1_234_567_890_123_456_789
    const expectedOutput = "1,234,567.9t"
    expect(formatWithScale(input, formatToPrecision1)).toBe(expectedOutput)
  })

  it("should not scale numbers less than 1k", () => {
    const input = 123.456
    const expectedOutput = "123.5"
    expect(formatWithScale(input, formatToPrecision1)).toBe(expectedOutput)
  })
})

// Note - these tests are dependent on the Intl values for the provided languages
describe("thousands and decimal formatters", () => {
  describe("getThousandsSeparator", () => {
    it("should find ',' for English, '\u00A0' for Russian, and '.' for German", () => {
      expect(getThousandsSeparator("EN")).toEqual(",")
      expect(getThousandsSeparator("RU")).toEqual("\u00A0")
      expect(getThousandsSeparator("DE")).toEqual(".")
    })
  })

  describe("getDecimalSeparator", () => {
    it("should find '.' for English, ',' for Russian, and ',' for German", () => {
      expect(getDecimalSeparator("EN")).toEqual(".")
      expect(getDecimalSeparator("RU")).toEqual(",")
      expect(getDecimalSeparator("DE")).toEqual(",")
    })
  })
})
