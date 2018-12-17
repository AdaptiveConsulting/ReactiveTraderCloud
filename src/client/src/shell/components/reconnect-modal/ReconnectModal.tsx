import React from 'react'

import { Flex, Modal } from 'rt-components'
import { Button } from 'rt-styleguide'
import { styled } from 'test-theme'

const Message = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  font-size: 0.75rem;
  line-height: 1.25rem;
`

interface Props {
  shouldShow: boolean
  reconnect: () => void
}

const ReconnectModal: React.SFC<Props> = ({ reconnect, shouldShow }) => (
  <Modal shouldShow={shouldShow} title="Session expired">
    <Flex direction="column" justifyContent="center" alignItems="center">
      <Message>Your 15 minute session expired, you are now disconnected from the server.</Message>

      <Button onClick={reconnect}>Reconnect and start a new session</Button>
    </Flex>
  </Modal>
)

export default ReconnectModal
