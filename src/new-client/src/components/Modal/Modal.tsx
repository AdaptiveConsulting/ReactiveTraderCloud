import { ReactNode, FC } from "react"
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
  onOverlayClick?: Function
}

// TODO disable tabbing outside of the modal
export const Modal: FC<Props> = ({
  shouldShow,
  title,
  children,
  onOverlayClick,
}) => {
  if (!shouldShow) {
    return null
  }
  return (
    <ModalContainer>
      <ModalOverlay onClick={(e) => onOverlayClick && onOverlayClick(e)} />
      <ModalPanel>
        {title && <Header>{title}</Header>}
        <Body>{children}</Body>
      </ModalPanel>
    </ModalContainer>
  )
}
