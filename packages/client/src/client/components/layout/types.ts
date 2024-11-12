import React from "react"

export interface LayoutProps {
  Header: JSX.Element
  Body: JSX.Element | JSX.Element[]
  style?: React.CSSProperties
}
