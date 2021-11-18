import { storiesOf } from "@storybook/react"
import Story from "@/stories/Story"

import {
  ModalContainer,
  ModalOverlay,
  ModalPanel,
  Body,
} from "./DisconnectionOverlay"

const stories = storiesOf("DisconnectionOverlay", module)

stories.add("DisconnectionOverlay ", () => (
  <Story>
    <ModalContainer>
      <ModalOverlay />
      <ModalPanel>
        <Body>Trying to re-connect to the server...</Body>
      </ModalPanel>
    </ModalContainer>
  </Story>
))
