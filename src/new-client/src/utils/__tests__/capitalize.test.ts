import { capitalize } from "utils/capitalize"

test("it should capitalize first and only first letter of string", () => {
  const funcInput = "the greatest story ever told in America"
  const funcOutput = "The greatest story ever told in America"
  expect(capitalize(funcInput)).toBe(funcOutput)
})

test("it should convert non-strings to strings, for downstream ops", () => {
  const funcInput = 134564
  const funcOutput = '134564'
  expect(capitalize(funcInput)).toBe(funcOutput)
})
