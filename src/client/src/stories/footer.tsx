import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { StatusIndicator } from '../ui/footer/StatusIndicator'
import footerProps from './footer/footerProps'

storiesOf('Footer', module)
  .add('StatusIndicator', () =>
    <StatusIndicator status={footerProps.applicationStatus}/>)
