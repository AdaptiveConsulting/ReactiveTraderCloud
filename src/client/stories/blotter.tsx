import * as React from 'react'
import { storiesOf } from '@storybook/react'

import { DateCell, NotionalCell } from '../src/ui/Blotter'
import Blotter from '../src/ui/Blotter/blotter'
import blottersProps from './blotter/blottersProps'
import { getCurrencyPairs } from './currencyPairs'

storiesOf('Blotter', module)
  .add('Full Blotter', () =>
    <Blotter {...blottersProps} currencyPairs={getCurrencyPairs()} />)
  .add('Date cell', () =>
    <div style={{ background: '#FFFFFF' }}>
      <DateCell formattedValue={new Date().toDateString()} classname={''}/>
    </div>)
  .add('Notional cell', () =>
    <div style={{ background: '#FFFFFF' }}>
      <DateCell
        classname="blotter__trade-field--align-right"
        formattedValue={'200 GBP'}
        />
    </div>)
