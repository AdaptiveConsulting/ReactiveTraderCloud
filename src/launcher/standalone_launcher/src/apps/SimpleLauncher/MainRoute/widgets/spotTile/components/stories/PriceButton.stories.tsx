import React from 'react'
import { boolean } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import PriceButton from '../PriceButton'
import { Flex } from 'rt-components'
import { Direction } from 'rt-types'
import { priceStories, Story, Centered } from './Initialise.stories'

const handleClick = action('execute')

priceStories.add('Price button', () => {
  const priceProps = boolean('No Rate', false)
    ? {}
    : {
        big: 33,
        pip: 1,
        tenth: 22,
        rawRate: 33.0122,
      }
  const isAnalyticsView = boolean('isAnalyticsView', false)

  return (
    <Story>
      <Centered>
        <Flex>
          <PriceButton
            direction={Direction.Buy}
            handleClick={handleClick}
            isAnalyticsView={isAnalyticsView}
            currencyPairSymbol={'eurusd'}
            {...priceProps}
          />
          <PriceButton
            direction={Direction.Sell}
            handleClick={handleClick}
            isAnalyticsView={isAnalyticsView}
            currencyPairSymbol={'eurusd'}
            {...priceProps}
          />
        </Flex>
      </Centered>
    </Story>
  )
})
