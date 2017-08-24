import * as React from 'react'
import PriceButton from '../PriceButton'
import ShallowRenderer from 'react-test-renderer/shallow'
import { mount } from 'enzyme'

function getButtonProps (type: string, action: any) {
  const classNameType = type === 'Sell' ? 'bid' : 'ask'

  return {
    className: `spot-tile__price spot-tile__price--${classNameType}`,
    direction: { name: type },
    rate: {
      pips: 5,
      bigFigure: 100,
      pipFraction: 8,
      rawRate: 123,
    },
    onExecute: action,
  }
}

describe('PriceButton', () => {
  let mockAction

  beforeEach(() => {
    mockAction = jest.fn(() => {})
  })
  
  test('renders correct markup for bid', () => {
    const shallowRenderer = new ShallowRenderer()
    const component = <PriceButton {...getButtonProps('bid', mockAction)} />
    shallowRenderer.render(component)

    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })

  test('renders correct markup for ask', () => {
    const shallowRenderer = new ShallowRenderer()
    const component = <PriceButton {...getButtonProps('ask', mockAction)} />
    shallowRenderer.render(component)

    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })

  test('onExecute action works', () => {
    const component = <PriceButton {...getButtonProps('ask', mockAction)} />
    mount(component).simulate('click')

    expect(mockAction).toBeCalled()
  })
})
