import { StyledButton } from "./LaunchButton.styled"

interface LaunchButtonProps {
  onClick: () => void
  iconFill?: string
  iconHoverFill?: string
  iconHoverBackground?: string
  children: JSX.Element[] | JSX.Element
  title?: string
  active?: boolean
}

export const LaunchButton = (props: LaunchButtonProps) => (
  <StyledButton
    title={props.title}
    onClick={props.onClick}
    iconFill={props.iconFill}
    iconHoverFill={props.iconHoverFill}
    iconHoverBackground={props.iconHoverBackground}
    active={props.active}
  >
    {props.children}
  </StyledButton>
)
