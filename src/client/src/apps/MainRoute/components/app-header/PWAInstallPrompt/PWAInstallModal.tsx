import React from 'react'
import { MobileDevice, InstallButton } from './PWAInstallPrompt'
import { Modal, AppleShareIcon } from 'rt-components'
import { styled } from 'rt-theme'

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
  device: MobileDevice | null
  closeModal: () => void
}

export const PWAInstallModal: React.FC<InstallModalProps> = ({ device, closeModal }) => (
  <Modal shouldShow>
    <ModalWrapper>
      <MainTitle>Install Reactive Trader</MainTitle>
      <Text>This must be done manually</Text>
      {device === MobileDevice.iOS ? (
        <DeviceText>
          Tap <Icon>{AppleShareIcon}</Icon> from the browsers bottom menu and select "Add to Home
          Screen"
        </DeviceText>
      ) : (
        <DeviceText>Go to your browser settings and select "Add to Home Screen"</DeviceText>
      )}
      <InstallButton onClick={closeModal}>Close</InstallButton>
    </ModalWrapper>
  </Modal>
)
