import React from 'react'
import { AppleShareIcon, Modal } from 'rt-components'
import styled from 'styled-components/macro'
import { InstallButton } from './PWAInstallPrompt'

const MainTitle = styled.div`
  font-size: 1.19rem;
  line-height: 2rem;
`

const Text = styled.div`
  font-size: 0.81rem;
  color: rgb(187, 187, 187);
`

const DeviceText = styled.div`
  margin: 10px 0 30px;
  font-size: 0.81rem;
  color: rgb(187, 187, 187);
  line-height: 2px;
`

const ModalWrapper = styled.div`
  text-align: center;
`

const Icon = styled.div`
  display: inline-flex;
  vertical-align: middle;
  margin-bottom: 4px;
`

interface InstallModalProps {
  closeModal: () => void
}

export const PWAInstallModal: React.FC<InstallModalProps> = ({ closeModal }) => (
  <Modal shouldShow>
    <ModalWrapper>
      <MainTitle>Install Reactive Trader</MainTitle>
      <Text>This must be done manually</Text>
      <DeviceText>
        Tap <Icon>{AppleShareIcon}</Icon> from the browsers menu and select "Add to Home Screen"
      </DeviceText>
      <InstallButton onClick={closeModal}>Close</InstallButton>
    </ModalWrapper>
  </Modal>
)
