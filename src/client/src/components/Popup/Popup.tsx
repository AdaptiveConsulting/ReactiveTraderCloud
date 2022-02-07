import { MouseEvent, useCallback } from "react"
import { PopupContainer, PopupPanel, Body } from "./styled"

interface Props {
  className?: string
  open?: boolean
  onClick?: (e: MouseEvent<HTMLDivElement>) => void
  minWidth?: string
}

const Popup: React.FC<Props> = ({
  className,
  open = false,
  onClick,
  children,
  minWidth,
}) => {
  const onPopupClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => onClick && onClick(e),
    [onClick],
  )

  return (
    <PopupContainer className={className} open={open} onClick={onPopupClick}>
      <PopupPanel minWidth={minWidth}>
        <Body>{children}</Body>
      </PopupPanel>
    </PopupContainer>
  )
}

export default Popup
