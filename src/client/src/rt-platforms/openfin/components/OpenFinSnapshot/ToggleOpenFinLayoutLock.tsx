import React, { useState } from 'react'
import styled from 'styled-components/macro'
import { toggleLayoutLock } from './utils'

const Container = styled('div')`
  padding: 0.75rem 0.75rem 0 0.75rem;
`

const LockButton = styled('button')`
  &:hover {
    color: ${({ theme }) => theme.accents.positive.base};
  }
`

const ToggleOpenFinLayoutLock = () => {
  const [locked, setLocked] = useState(false)

  const toggle = () => {
    setLocked(!locked)
    toggleLayoutLock()
  }

  return (
    <Container>
      <LockButton onClick={toggle}>{locked ? 'Unlock Layout' : 'Lock Layout'}</LockButton>
    </Container>
  )
}

export default ToggleOpenFinLayoutLock
