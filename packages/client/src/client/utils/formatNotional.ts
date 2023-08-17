import {
  createApplyCharacterMultiplier,
  customNumberFormatter,
  DECIMAL_SEPARATOR,
  parseQuantity,
} from "./formatNumber"

export const formatNotional = (
  rawVal: string,
  characterMultipliers: ("k" | "m")[],
  formatterOptions?: Intl.NumberFormatOptions,
): [number, string] => {
  const applyCharacterMultiplier =
    createApplyCharacterMultiplier(characterMultipliers)

  const formatter = customNumberFormatter(formatterOptions)

  const numValue = Math.abs(parseQuantity(rawVal))
  const lastChar = rawVal.slice(-1).toLowerCase()
  const value = applyCharacterMultiplier(numValue, lastChar)

  return [
    value,
    formatter(value) +
      (lastChar === DECIMAL_SEPARATOR ? DECIMAL_SEPARATOR : ""),
  ]
}
