import { getNumericNotional, isValueInRfqRange, isValueOverRftRange } from './TileBusinessLogic'

test('getNumericNotional', () => {
  const numericValue = getNumericNotional('1,000,000')
  expect(numericValue).toBe(1000000)

  const numericValue2 = getNumericNotional('1,000.00')
  expect(numericValue2).toBe(1000)

  const numericValue3 = getNumericNotional('7800')
  expect(numericValue3).toBe(7800)

  const numericValue4 = getNumericNotional(1200 as any)
  expect(numericValue4).toBe(1200)
})

test('isValueInRfqRange', () => {
  const isInRange = isValueInRfqRange('1,000,000')
  expect(isInRange).toBe(false)

  const isInRange2 = isValueInRfqRange('10,000,000')
  expect(isInRange2).toBe(true)

  const isInRange3 = isValueInRfqRange('999,999,999.99')
  expect(isInRange3).toBe(true)

  const isInRange4 = isValueInRfqRange('1,000,000,000')
  expect(isInRange4).toBe(true)

  const isInRange5 = isValueInRfqRange('1,000,000,001')
  expect(isInRange5).toBe(false)
})

test('isValueOverRftRange', () => {
  const isInRange = isValueOverRftRange('1,000,000')
  expect(isInRange).toBe(false)

  const isInRange2 = isValueOverRftRange('10,000,000')
  expect(isInRange2).toBe(false)

  const isInRange3 = isValueOverRftRange('999,999,999.99')
  expect(isInRange3).toBe(false)

  const isInRange4 = isValueOverRftRange('1,000,000,000')
  expect(isInRange4).toBe(false)

  const isInRange5 = isValueOverRftRange('1,000,000,001')
  expect(isInRange5).toBe(true)
})
