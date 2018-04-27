/* tslint:disable */

import * as React from 'react'
import NotionalInput from '../notional/NotionalInput'
import ShallowRenderer from 'react-test-renderer/shallow'
import { mount } from 'enzyme'


describe('NotionalInput', () => {
  let component
  let mockAction

  beforeEach(() => {
    mockAction = jest.fn(() => {})
    component = <NotionalInput
      className={'notional'}
      notional={'999999K'}
      currencyPair={{
        symbol: 'GBP',
        base: 'GBP',
      }}
      onNotionalInputChange={mockAction}
    />
  })

  test('renders correct markup', () => {
    const shallowRenderer = new ShallowRenderer()
    shallowRenderer.render(component)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })

  test('onNotionalInputChange triggers when using shorthand value with "k"', () => {
    const mounted = mount(component)
    mounted.find('input').get(0).value = '12k'
    mounted.find('input').simulate('change')
    expect(mockAction).toBeCalled()
  })

  test('onNotionalInputChange triggers when using shorthand value with "m"', () => {
    const mounted = mount(component)
    mounted.find('input').get(0).value = '10m'
    mounted.find('input').simulate('change')
    expect(mockAction).toBeCalled()
  })

  test('onNotionalInputChange does not trigger for regular values', () => {
    const mounted = mount(component)
    mounted.find('input').get(0).value = '10'
    mounted.find('input').simulate('change')
    expect(mockAction).not.toBeCalled()
  })
})
