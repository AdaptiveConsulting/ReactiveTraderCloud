/* tslint:disable */
import React from 'react'
import TradeNotification from '../tradeNotification'
import ShallowRenderer from 'react-test-renderer/shallow'
import { mount } from 'enzyme'

describe.skip('TradeNotification', () => {

  test('dismisses the error message when hasError', () => {
    const mockOnDismissedClicked = jest.fn(() => {})
    const notification = {
      hasError: true,
      status: 'rejected',
      dealtCurrency: 'GBP',
      notional: 12345,
      termsCurrency: 'GBP',
      direction: 'Up',
      spotRate: 1,
      formattedValueDate: '12/12/2012',
      tradeId: 'ABC',
    }
    const component = <TradeNotification
          notification={notification}
          onDismissedClicked={mockOnDismissedClicked}/>

    const mounted = mount(component)
    mounted.find('a').simulate('click')
    expect(mockOnDismissedClicked).toBeCalled()
  })

  test('renders correct markup for all statuses', () => {
    const tradeStatus = [
      'rejected',
      'done',
      'pending',
    ]

    tradeStatus.forEach((status) => {
      const notification = {
        hasError: false,
        status: status,
        dealtCurrency: 'GBP',
        notional: 12345,
        termsCurrency: 'GBP',
        direction: 'Up',
        spotRate: 1,
        formattedValueDate: '12/12/2012',
        tradeId: 'ABC',
      }
      const component = <TradeNotification
            notification={notification}
            onDismissedClicked={() => {}}/>

      const shallowRenderer = new ShallowRenderer()
      shallowRenderer.render(component)
      expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
    })

  })
})
