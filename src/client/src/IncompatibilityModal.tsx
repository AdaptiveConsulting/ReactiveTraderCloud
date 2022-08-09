import styled from "styled-components"
import { Modal } from "./components/Modal"

const ServicesWrapper = styled.ul`
  list-style: none;
`
export function IncompatibilityModal({ reasons }: { reasons: string[] }) {
  return (
    <Modal
      title="Sorry, but it appears that api version is incompatible, please update it..."
      shouldShow
    >
      <ServicesWrapper>
        {reasons.map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ServicesWrapper>
    </Modal>
  )
}
