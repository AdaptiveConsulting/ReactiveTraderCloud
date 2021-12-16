import { FC } from "react"
import styled from "styled-components"

interface Props {
  title: string
  active?: boolean
  hover?: boolean
  disabled?: boolean
}

export const ListItem: FC<Props> = ({ title, active, hover, disabled }) => {
  return (
    <Root active={active} hover={hover} disabled={disabled}>
      {title}
    </Root>
  )
}

const Root = styled.div<{
  active?: boolean
  hover?: boolean
  disabled?: boolean
}>`
  padding: 8px 8px 5px 8px;
  background-color: ${({ theme, active, hover }) =>
    active
      ? theme.core.activeColor
      : hover
      ? theme.primary.base
      : theme.core.dividerColor};
  width: 115px;
  border-radius: 3px;
  text-decoration: ${({ hover }) => (hover ? "underline" : "none")};
  font-size: 11px;
  pointer-events: ${({ disabled }) => (disabled ? "none" : "inherit")};
  color: ${({ disabled }) => (disabled ? "rgb(107, 107, 107)" : "inherit")};
  cursor: ${({ disabled }) => (disabled ? "inherit" : "pointer")};
  box-shadow: 0 0.25rem 0.375rem rgba(50, 50, 93, 0.11),
    0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.08);
`
