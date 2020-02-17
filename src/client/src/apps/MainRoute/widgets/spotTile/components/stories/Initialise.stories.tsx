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

export const stories = storiesOf('Spot Tile', module).addDecorator(withKnobs)
export const priceStories = storiesOf('Spot Tile.Components.Price', module).addDecorator(withKnobs)
export const rfqStories = storiesOf('Spot Tile.Components.RFQ', module).addDecorator(withKnobs)
export const notionalStories = storiesOf('Spot Tile.Components.Notional', module).addDecorator(
  withKnobs,
)
export const analyticsTileStories = storiesOf('Spot Tile.Vertical', module).addDecorator(withKnobs)
export const spotTileStories = storiesOf('Spot Tile.Horizontal', module).addDecorator(withKnobs)
export const componentStories = storiesOf('Spot Tile.Components', module).addDecorator(withKnobs)
