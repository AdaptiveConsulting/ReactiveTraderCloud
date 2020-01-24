import React from 'react'

import { withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'

import { Story as BaseStory } from 'rt-storybook'
import { styled } from 'rt-theme'

export const Centered = styled('div')`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Story: React.FC = ({ children }) => <BaseStory>{children}</BaseStory>

export const stories = storiesOf('Spot Tile', module)
export const priceStories = storiesOf('Spot Tile.Price', module)
export const rfqStories = storiesOf('Spot Tile.RFQ', module)
export const analyticsTileStories = storiesOf('Spot Tile.Analytic Tile', module)
export const spotTileStories = storiesOf('Spot Tile.SpotTile', module)

stories.addDecorator(withKnobs)
