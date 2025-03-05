import { StackProps } from "../Stack"

export interface LayoutProps extends StackProps {
  Header: JSX.Element | string
  Body: JSX.Element | JSX.Element[]
  className?: string
}
