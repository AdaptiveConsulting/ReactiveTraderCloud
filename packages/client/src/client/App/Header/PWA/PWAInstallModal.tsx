import { Button } from "@/client/components/Button"
import { AppleShareIcon } from "@/client/components/icons"
import { Modal } from "@/client/components/Modal"

import {
  DeviceText,
  Icon,
  MainTitle,
  ModalWrapper,
  Text,
} from "./PWAInstallModal.styles"

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
      <Button variant="primary" size="sm" onClick={closeModal}>
        Close
      </Button>
    </ModalWrapper>
  </Modal>
)
