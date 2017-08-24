import * as React from 'react'
import TradeNotification from '../TradeNotification'
import ShallowRenderer from 'react-test-renderer/shallow'
import { mount } from 'enzyme'

describe.only('TradeNotification', () => {

  test('dismisses the error message when hasError', () => {
    const mockOnDismissedClicked = jest.fn(() => {})
    const notification = {
      hasError: true,
      status: {
        name: 'Rejected',
      },
      dealtCurrency: 'GBP',
      notional: 12345,
      termsCurrency: 'GBP',
      direction: 'Up',
      spotRate: 1,
      formattedValueDate: '12/12/2012',
      tradeId: 'ABC',
    }
    const component = <TradeNotification
          className="spot-tile__trade-summary"
          notification={notification}
          onDismissedClicked={mockOnDismissedClicked}/>

    const mounted = mount(component)
    mounted.find('a').simulate('click')
    expect(mockOnDismissedClicked).toBeCalled()
  })

  test('renders correct markup for all statuses', () => {
    const tradeStatus = [
      { name: 'Rejected' },
      { name: 'Done' },
      { name: 'Pending' },
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
            className="spot-tile__trade-summary"
            notification={notification}
            onDismissedClicked={() => {}}/>

      const shallowRenderer = new ShallowRenderer()
      shallowRenderer.render(component)
      expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
    })

  })
})
