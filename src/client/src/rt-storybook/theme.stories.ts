import { withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'

const stories = storiesOf('Theme', module)
stories.addDecorator(withKnobs)

export default stories
