import React, { MouseEvent, useCallback } from 'react'
import { PopupContainer, PopupPanel, Body } from './styled'

interface Props {
  className?: string
  open?: boolean
  onClick?: (e: MouseEvent<HTMLDivElement>) => void
}

const Popup: React.FC<Props> = ({ className, open = false, onClick, children }) => {
  const onPopupClick = useCallback((e: MouseEvent<HTMLDivElement>) => onClick && onClick(e), [
    onClick,
  ])

  return (
    <PopupContainer className={className} open={open} onClick={onPopupClick}>
      <PopupPanel>
        <Body>{children}</Body>
      </PopupPanel>
    </PopupContainer>
  )
}

export default Popup
