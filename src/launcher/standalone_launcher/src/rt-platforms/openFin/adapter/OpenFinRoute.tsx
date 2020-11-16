import React, { FC, ReactNode } from 'react'
import { OpenFinChrome } from '../components'

interface RouteWrapperProps {
  children?: ReactNode
}

export const OpenFinRoute: FC<RouteWrapperProps> = ({ children }) => {
  return <OpenFinChrome>{children}</OpenFinChrome>
}

export default OpenFinRoute
