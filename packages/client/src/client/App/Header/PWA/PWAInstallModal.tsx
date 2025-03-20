import { Button } from "@/client/components/Button"
import { AppleShareIcon } from "@/client/components/icons"
import { Modal } from "@/client/components/Modal"
import { Typography } from "@/client/components/Typography"

import { IconWrapper, ModalWrapper } from "./PWAInstallModal.styles"

interface InstallModalProps {
  closeModal: () => void
}

export const PWAInstallModal = ({ closeModal }: InstallModalProps) => (
  <Modal shouldShow>
    <ModalWrapper>
      <Typography variant="Display sm/Regular" paddingBottom="lg">
        Install Reactive Trader
      </Typography>
      <Typography
        variant="Text sm/Regular"
        color="Colors/Text/text-secondary (700)"
      >
        This must be done manually
      </Typography>
      <Typography
        variant="Text sm/Regular"
        color="Colors/Text/text-secondary (700)"
        paddingBottom="md"
      >
        Tap{" "}
        <IconWrapper>
          <AppleShareIcon />
        </IconWrapper>{" "}
        from the browsers menu and select &quot;Add to Home Screen&quot;
      </Typography>
      <Button variant="outline" size="lg" onClick={closeModal}>
        Close
      </Button>
    </ModalWrapper>
  </Modal>
)
