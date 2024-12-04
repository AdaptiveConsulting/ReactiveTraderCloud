import { ReactNode } from "react"

import { Typography } from "../Typography"
import {
  Body,
  Header,
  ModalContainer,
  ModalOverlay,
  ModalPanel,
} from "./Modal.styles"

interface Props {
  shouldShow?: boolean
  title?: string | ReactNode | undefined
  onOverlayClick?: (e: React.MouseEvent<HTMLElement>) => void
  children: ReactNode
}

// TODO disable tabbing outside of the modal
export const Modal = ({
  shouldShow,
  title,
  children,
  onOverlayClick,
}: Props) => {
  if (!shouldShow) {
    return null
  }
  return (
    <ModalContainer>
      <ModalOverlay onClick={(e) => onOverlayClick && onOverlayClick(e)} />
      <ModalPanel>
        {title && (
          <Header>
            <Typography variant="Display sm/Regular">{title}</Typography>
          </Header>
        )}
        <Body>{children}</Body>
      </ModalPanel>
    </ModalContainer>
  )
}
