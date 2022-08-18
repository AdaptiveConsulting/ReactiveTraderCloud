import { useState } from "react"
import styled from "styled-components"
import { Modal } from "./components/Modal"

const ServicesWrapper = styled.ul`
  list-style: none;
`

export function IncompatibilityModal({
  isCompatible,
  reasons,
}: {
  isCompatible: boolean
  reasons: string[]
}) {
  const [shouldShowModal, setShouldShowModal] = useState(!isCompatible)

  return (
    <Modal
      title="Sorry, but it appears that api version is incompatible, please update it..."
      shouldShow={shouldShowModal}
      onOverlayClick={() => setShouldShowModal(false)}
    >
      <ServicesWrapper>
        {reasons.map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ServicesWrapper>
    </Modal>
  )
}
