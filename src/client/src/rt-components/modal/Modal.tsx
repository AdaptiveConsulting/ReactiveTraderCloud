import { darken } from 'polished'
import React from 'react'

import { styled } from 'rt-theme'

const ModalContainer = styled.div`
  position: fixed;
  z-index: 5;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
`

const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  opacity: 0.75;

  background: ${({ theme }) => theme.overlay.backgroundColor};
`

const ModalPanel = styled.div`
  padding: 1rem 1.5rem;

  width: max-content;
  min-width: 16rem;
  max-width: 40rem;

  position: relative;
  z-index: 1;

  background: ${({ theme }) => theme.core.lightBackground};
  color: ${({ theme }) => theme.core.textColor};
  border-radius: 0.25rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05),
    0 1rem 3rem -1rem ${props => darken(0.1, props.theme.overlay.backgroundColor)};
`

const Header = styled.div`
  font-size: 1rem;
  line-height: 3rem;
  box-shadow: 0 1px 0 ${({ theme }) => theme.core.textColor};
`

const Body = styled.div`
  margin: 1rem 0;
`

interface Props {
  shouldShow?: boolean
  title?: string
}

// TODO disable tabbing outside of the modal
// tslint:disable-next-line:variable-name
const Modal: React.FC<Props> = ({ shouldShow, title, children }) => {
  if (!shouldShow) {
    return <></>
  }
  return (
    <ModalContainer>
      <ModalOverlay />
      <ModalPanel>
        {title && <Header>{title}</Header>}
        <Body>{children}</Body>
      </ModalPanel>
    </ModalContainer>
  )
}

export default Modal
