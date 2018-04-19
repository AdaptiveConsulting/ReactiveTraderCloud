/* tslint:disable */

import * as React from 'react'
import PriceMovementIndicator from '../PriceMovementIndicator'
import ShallowRenderer from 'react-test-renderer/shallow'
import { mount } from 'enzyme'

describe('PriceMovementIndicator', () => {
  test('renders correct markup Down', () => {
    const component = <PriceMovementIndicator
                    priceMovementType={'Down'}
                    spread={{
                      formattedValue: '-1.23',
                    }}/>
    const shallowRenderer = new ShallowRenderer()
    shallowRenderer.render(component)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })

  test('renders correct markup Up', () => {
    const component = <PriceMovementIndicator
                    priceMovementType={'Up'}
                    spread={{
                      formattedValue: '-1.23',
                    }}/>
    const shallowRenderer = new ShallowRenderer()
    shallowRenderer.render(component)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
})
