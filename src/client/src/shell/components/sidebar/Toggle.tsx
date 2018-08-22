import React from 'react'

interface ToggleProps {
  show: boolean
}

const Toggle: React.SFC<ToggleProps> | any = ({ show, children }) => (show && children) || null

export default Toggle
