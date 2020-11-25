import { isOpenFin } from 'apps/MainRoute/widgets/contact-us/utils'
import styled from 'styled-components/macro'

/**
 * The OpenFin Platform API is responsible for the popping in and out of its own
 * views. This includes the controls. So, we hide our own PopoutButton when on
 * OpenFin and point their controls to our images to maintain a uniform look
 */
export const PopoutButton = styled('button')`
  ${isOpenFin ? 'display: none;' : ''}
  &:hover {
    .hover-state {
      fill: #4f94f5;
    }
  }
`
