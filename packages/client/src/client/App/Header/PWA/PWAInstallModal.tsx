import { Button } from "@/client/components/Button"
import { Gap } from "@/client/components/Gap"
import { AppleShareIcon } from "@/client/components/icons"
import { Modal } from "@/client/components/Modal"
import { Typography } from "@/client/components/Typography"

import { Icon, ModalWrapper } from "./PWAInstallModal.styles"

interface InstallModalProps {
  closeModal: () => void
}

export const PWAInstallModal = ({ closeModal }: InstallModalProps) => (
  <Modal shouldShow>
    <ModalWrapper>
      <Typography variant="Display sm/Regular">
        Install Reactive Trader
      </Typography>
      <Gap height="lg" />
      <Typography
        variant="Text sm/Regular"
        color="Colors/Text/text-secondary (700)"
      >
        This must be done manually
      </Typography>
      <Typography
        variant="Text sm/Regular"
        color="Colors/Text/text-secondary (700)"
      >
        Tap <Icon>{AppleShareIcon}</Icon> from the browsers menu and select
        &quot;Add to Home Screen&quot;
      </Typography>
      <Gap height="md" />
      <Button variant="outline" size="lg" onClick={closeModal}>
        Close
      </Button>
    </ModalWrapper>
  </Modal>
)
