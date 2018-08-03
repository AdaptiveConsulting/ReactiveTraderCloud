import React from 'react'
import Ink from 'react-ink'

import { Flex, Modal } from 'rt-components'
import { styled } from 'rt-util'

const Message = styled('h4')`
  font-size: ${({ theme }) => theme.fontSize.h4};
  margin: 0px;
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  span {
    margin: 3px;
  }
`

const Button = styled('div')`
  position: relative;
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 34px;
  padding-left: 30px;
  padding-right: 30px;
  background-color: ${({ theme }) => theme.palette.accentPrimary.normal};
  color: ${({ theme }) => theme.text.light};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.animationSpeed.fast}ms;
  &&:hover {
    background-color: ${({ theme }) => theme.palette.accentPrimary.light};
  }
`

interface Props {
  shouldShow: boolean
  reconnect: () => void
}
const ReconnectModal: React.SFC<Props> = ({ reconnect, shouldShow }) => (
  <Modal shouldShow={shouldShow} title="Session expired">
    <Flex direction="column" justifyContent="center" alignItems="center">
      <Message>
        <span>Your 15 minute session expired, you are now disconnected from the server.</span>
        <span>Click reconnect to start a new session.</span>
      </Message>
      <Button onClick={reconnect}>
        <Ink />Reconnect
      </Button>
    </Flex>
  </Modal>
)

export default ReconnectModal
