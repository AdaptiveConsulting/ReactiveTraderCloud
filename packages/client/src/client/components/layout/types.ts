import React from "react"

export interface LayoutProps {
  Header: JSX.Element | string
  Body: JSX.Element | JSX.Element[]
  style?: React.CSSProperties
}
