import { number, withKnobs } from '@storybook/addon-knobs/react'
import React from 'react'

import { storiesOf } from '@storybook/react'

import { Flex } from 'rt-components'
import { Story } from 'rt-storybook'

import AdaptiveLoader from './AdaptiveLoader'

const AdaptiveLoaderStory: React.FC = ({ children }) => (
  <Story>
    <Flex width="100%" height="100%" direction="column" alignItems="center" justifyContent="center">
      {children}
    </Flex>
  </Story>
)

const stories = storiesOf('AdaptiveLoader', module).addDecorator(withKnobs)

stories.add('Interactive', () => {
  const size = number('size', 50)
  const speed = number('speed', 1)
  const seperation = number('separation', 3)

  return (
    <AdaptiveLoaderStory>
      <AdaptiveLoader size={size} type="secondary" speed={speed} seperation={seperation} />
    </AdaptiveLoaderStory>
  )
})

stories.add('Small', () => (
  <AdaptiveLoaderStory>
    <AdaptiveLoader size={50} type="secondary" />
  </AdaptiveLoaderStory>
))

stories.add('Large', () => (
  <AdaptiveLoaderStory>
    <AdaptiveLoader size={500} type="secondary" />
  </AdaptiveLoaderStory>
))

stories.add('Close', () => (
  <AdaptiveLoaderStory>
    <AdaptiveLoader size={200} type="secondary" seperation={0} />
  </AdaptiveLoaderStory>
))

stories.add('Fast', () => (
  <AdaptiveLoaderStory>
    <AdaptiveLoader size={60} type="secondary" speed={0.5} />
  </AdaptiveLoaderStory>
))
