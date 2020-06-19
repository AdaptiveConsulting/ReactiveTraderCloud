import React from 'react'
import { Device, InstallButton } from './PWAInstallBanner'
import { Modal } from 'rt-components'
import { styled } from 'rt-theme'

const MainTitle = styled.div`
  font-size: 1.19rem;
  line-height: 2rem;
`

const Text = styled.div`
  font-size: 0.81rem;
  color: rgb(187, 187, 187);
`

const ModalWrapper = styled.div`
  text-align: center;
`

export const MobileInstallModal: React.FC<{ device: Device | null }> = ({ device }) => (
  <Modal shouldShow>
    <ModalWrapper>
      <MainTitle>Install Reactive Trader</MainTitle>
      <Text>This must be done manually</Text>
      <Text>
        {device === Device.iOS
          ? 'Tap APPLE from the browsers bottom menu and select "Add to home Screen"'
          : 'Tap Android from the browsers bottom menu and select "Add to home Screen"'}
      </Text>
      <InstallButton>Close</InstallButton>
    </ModalWrapper>
  </Modal>
)
