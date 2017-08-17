import Rate from '../../../src/services/model/rate'

describe('Rate Tests', () => {

  describe('rate precision of 4', () => {
    let rate

    beforeEach(() => {
      rate = new Rate(1.07451, 5, 4) // EURUSD like rate and precision
    })

    test('extracts the big figure', () => {
      expect(rate.bigFigure).toEqual(1.07)
    })

    test('extracts the pips', () => {
      expect(rate.pips).toEqual(45)
    })

    test('extracts the pip fraction', () => {
      expect(rate.pipFraction).toEqual(1)
    })
  })

  describe('rate precision of 3', () => {
    let rate

    beforeEach(() => {
      rate = new Rate(183.794, 3, 2)  // GBPJPY like rate and precision
    })

    test('extracts the big figure', () => {
      expect(rate.bigFigure).toEqual(183)
    })

    test('extracts the pips', () => {
      expect(rate.pips).toEqual(79)
    })

    test('extracts the pip fraction', () => {
      expect(rate.pipFraction).toEqual(4)
    })
  })
})


