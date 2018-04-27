import { linkTo } from '@storybook/addon-links'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { Modal } from '../ui/modal/index'

storiesOf('Modal', module)
  .add('Showing modal', () =>
    <Modal shouldShow={true} title="Modal message">
      <div>Child component in the modal</div>
      <button className="btn shell__button--reconnect"
              onClick={linkTo('Modal', 'Not showing modal')}>Click to test shouldShow=false
      </button>
    </Modal>)
  .add('Not showing modal', () =>
    <Modal shouldShow={false} title="Modal message">
      <div>Child component in the modal</div>
    </Modal>)
