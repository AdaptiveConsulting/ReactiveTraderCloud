import { FC } from "react"
import { AppleShareIcon } from "@/components/icons"
import { Modal } from "@/components/Modal"
import {
  ModalWrapper,
  DeviceText,
  Icon,
  MainTitle,
  Text,
} from "./PWAInstallModal.styles"
import { InstallButton } from "./PWAInstallPrompt.styles"

interface InstallModalProps {
  closeModal: () => void
}

export const PWAInstallModal: FC<InstallModalProps> = ({ closeModal }) => (
  <Modal shouldShow>
    <ModalWrapper>
      <MainTitle>Install Reactive Trader</MainTitle>
      <Text>This must be done manually</Text>
      <DeviceText>
        Tap <Icon>{AppleShareIcon}</Icon> from the browsers menu and select "Add
        to Home Screen"
      </DeviceText>
      <InstallButton onClick={closeModal}>Close</InstallButton>
    </ModalWrapper>
  </Modal>
)
