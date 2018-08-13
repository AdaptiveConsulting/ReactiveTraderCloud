import { storiesOf } from '@storybook/react'
import React from 'react'

import { Story } from 'rt-storybook'
import SidePanel from './SidePanel'

const stories = storiesOf('SidePanel', module)

stories.add('SidePanel', () => (
  <Story>
    <SidePanel width="20%">
      <h1>Sidepanel</h1>
      <p>With some content</p>
    </SidePanel>
  </Story>
))
