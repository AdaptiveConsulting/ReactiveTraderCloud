import React, { FC, ReactNode } from 'react'
import { OpenFinChrome } from '../components'

interface RouteWrapperProps {
  children?: ReactNode
  title: string
}

export const OpenFinRoute: FC<RouteWrapperProps> = ({ children, title }) => {
  return <OpenFinChrome title={title}>{children}</OpenFinChrome>
}

export default OpenFinRoute
