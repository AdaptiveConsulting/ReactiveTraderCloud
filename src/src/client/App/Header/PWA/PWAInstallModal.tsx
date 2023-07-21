import { AppleShareIcon } from "@/client/components/icons"
import { Modal } from "@/client/components/Modal"

import {
  DeviceText,
  Icon,
  MainTitle,
  ModalWrapper,
  Text,
} from "./PWAInstallModal.styles"
import { InstallButton } from "./PWAInstallPrompt.styles"

interface InstallModalProps {
  closeModal: () => void
}

export const PWAInstallModal = ({ closeModal }: InstallModalProps) => (
  <Modal shouldShow>
    <ModalWrapper>
      <MainTitle>Install Reactive Trader</MainTitle>
      <Text>This must be done manually</Text>
      <DeviceText>
        Tap <Icon>{AppleShareIcon}</Icon> from the browsers menu and select
        &quot;Add to Home Screen&quot;
      </DeviceText>
      <InstallButton onClick={closeModal}>Close</InstallButton>
    </ModalWrapper>
  </Modal>
)
