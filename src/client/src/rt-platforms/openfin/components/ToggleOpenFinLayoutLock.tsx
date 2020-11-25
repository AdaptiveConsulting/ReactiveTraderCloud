import React, { useState } from 'react'
import { isOpenFin } from 'apps/MainRoute/widgets/contact-us/utils'
import styled from 'styled-components/macro'
import { toggleLockedLayout } from './utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add(faLock, faLockOpen)

const OpenFinOnlyButton = styled('button')`
  ${isOpenFin ? '' : 'display: none;'}
`

const ToggleOpenFinLayoutLock = () => {
  const [locked, setLocked] = useState(false)

  const toggle = () => {
    setLocked(!locked)
    toggleLockedLayout()
  }

  return (
    <OpenFinOnlyButton onClick={toggle}>
      {locked ? <FontAwesomeIcon icon="lock" /> : <FontAwesomeIcon icon="lock-open" />}
    </OpenFinOnlyButton>
  )
}

export default ToggleOpenFinLayoutLock
