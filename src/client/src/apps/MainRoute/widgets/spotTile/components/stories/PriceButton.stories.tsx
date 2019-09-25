import React from 'react'
import { boolean } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import PriceButton from '../PriceButton'
import { Flex } from 'rt-components'
import { Direction } from 'rt-types'
import { stories, Story, Centered } from './Initialise.stories'

const handleClick = action('execute')

stories.add('Price button', () => {
  const priceProps = boolean('No Rate', false)
    ? {}
    : {
        big: 33,
        pip: 1,
        tenth: 22,
        rawRate: 33.0122,
      }

  return (
    <Story>
      <Centered>
        <Flex>
          <PriceButton
            direction={Direction.Buy}
            handleClick={handleClick}
            currencyPairSymbol={'eurusd'}
            {...priceProps}
          />
          <PriceButton
            direction={Direction.Sell}
            handleClick={handleClick}
            currencyPairSymbol={'eurusd'}
            {...priceProps}
          />
        </Flex>
      </Centered>
    </Story>
  )
})
