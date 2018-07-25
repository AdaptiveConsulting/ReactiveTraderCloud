import React from 'react'

import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import { action } from '@storybook/addon-actions'

import { Footer } from '../src/ui/footer/Footer'

const stories = storiesOf('Components', module)

stories.add('Footer', withInfo({ inline: true })(() => <Footer />))
