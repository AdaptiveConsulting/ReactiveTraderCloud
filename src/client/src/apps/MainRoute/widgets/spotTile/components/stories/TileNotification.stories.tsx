import React from 'react'
import { Centered, stories, Story } from './Initialise.stories'
import TileNotification, { TileNotificationLevel } from '../notifications/TileNotification'
import { select } from '@storybook/addon-knobs'

const notificationLevels = {
  Success: 'success',
  Info: 'info',
  Warning: 'warning'
}
stories.add('TileNotification', () => {
  const notificationLevel = select('Notification level', notificationLevels, 'success')
  return (
    <Story>
      <Centered>
        <TileNotification
          style={{ color: 'white', width: '320px', height: '150px' }}
          notificationLevel={notificationLevel as TileNotificationLevel}
          symbols="EUR/USD"
        >
          <div>Some content</div>
        </TileNotification>
      </Centered>
    </Story>
  )
})
