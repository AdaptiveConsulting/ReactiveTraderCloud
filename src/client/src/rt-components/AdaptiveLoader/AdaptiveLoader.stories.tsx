import React from 'react'

import { storiesOf } from '@storybook/react'

import { Flex } from 'rt-components'
import { Story } from 'rt-storybook'

import AdaptiveLoader, { LOADER_TYPE } from './AdaptiveLoader'

const AdaptiveLoaderStory: React.SFC = ({ children }) => (
  <Story>
    <Flex width="100%" height="100%" direction="column" alignItems="center" justifyContent="center">
      {children}
    </Flex>
  </Story>
)

const stories = storiesOf('AdaptiveLoader', module)

stories.add('Small', () => (
  <AdaptiveLoaderStory>
    <AdaptiveLoader size={50} type={LOADER_TYPE.SECONDARY} />
  </AdaptiveLoaderStory>
))

stories.add('Large', () => (
  <AdaptiveLoaderStory>
    <AdaptiveLoader size={500} type={LOADER_TYPE.SECONDARY} />
  </AdaptiveLoaderStory>
))

stories.add('Close', () => (
  <AdaptiveLoaderStory>
    <AdaptiveLoader size={200} type={LOADER_TYPE.SECONDARY} seperation={0} />
  </AdaptiveLoaderStory>
))

stories.add('Fast', () => (
  <AdaptiveLoaderStory>
    <AdaptiveLoader size={60} type={LOADER_TYPE.SECONDARY} speed={0.5} />
  </AdaptiveLoaderStory>
))
