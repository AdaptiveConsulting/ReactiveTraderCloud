import React, { useState } from 'react'
import { isOpenFin } from 'apps/MainRoute/widgets/contact-us/utils'
import styled from 'styled-components/macro'
import { toggleLockedLayout } from './utils'

const OpenFinOnlyButton = styled('button')`
  ${isOpenFin ? '' : 'display: none;'}
`

const ToggleOpenFinLayoutLock = () => {
  const [locked, setLocked] = useState(false)

  const toggle = () => {
    setLocked(!locked)
    toggleLockedLayout()
  }

  return <OpenFinOnlyButton onClick={toggle}>{locked ? 'U' : 'L'}</OpenFinOnlyButton>
}

export default ToggleOpenFinLayoutLock
