import { boolean, select, text } from '@storybook/addon-knobs/react'
import React from 'react'

import { Story } from 'rt-storybook'
import stories from 'rt-storybook/theme.stories'

import Typography from './Typography'

const fontWeightOptions = {
  Light: '300',
  Regular: '400',
  Bold: '700'
}

stories.add('Typography', () => {
  const sampleText = text('Sample Text', 'Adaptive Financial')
  const fontWeight = select('Font Weight', fontWeightOptions, '400')
  const italic = boolean('Italic?', false)
  return (
    <Story>
      <Typography sampleText={sampleText} fontWeight={fontWeight} italic={italic} />
    </Story>
  )
})
