import * as React from 'react'
import { storiesOf } from '@storybook/react'

import footerProps from './footer/footerProps'
import { StatusIndicator } from '../src/ui/footer/StatusIndicator';

storiesOf('Footer', module)
  .add('StatusIndicator', () =>
    <StatusIndicator status={footerProps.applicationStatus}/>)
