import { cleanKeys } from "./cleanKeys"

it("should clean radius names", () => {
  const testRadii = {
    "radius-none": 0,
    "radius-xxs": 2,
    "radius-xs": 4,
    "radius-sm": 6,
    "radius-md": 8,
    "radius-xl": 12,
    "radius-2xl": 16,
    "radius-4xl": 24,
    "radius-full": 9999,
    "radius-lg": 10,
    "radius-3xl": 20,
  }

  const expected = {
    none: 0,
    xxs: 2,
    xs: 4,
    sm: 6,
    md: 8,
    xl: 12,
    "2xl": 16,
    "4xl": 24,
    full: 9999,
    lg: 10,
    "3xl": 20,
  }

  expect(cleanKeys(testRadii, "radius")).toEqual(expected)
})
