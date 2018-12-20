import React from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { styled } from 'rt-theme'

library.add(faCopy)
import CopyToClipboard from 'react-copy-to-clipboard'

interface ColorToClipBoardProps {
  color: string
  iconColor: string
}
export const CopyToClipBoardWrapper = styled.div`
  visibility: hidden;
`
const onClick = () => {
  alert('copied to clipboard')
}
const ColorToClipBoard: React.SFC<ColorToClipBoardProps> = ({ color, iconColor }) => (
  <CopyToClipBoardWrapper>
    <CopyToClipboard text={color}>
      <button onClick={onClick}>
        <FontAwesomeIcon icon="copy" style={{ color: iconColor }} />
      </button>
    </CopyToClipboard>
  </CopyToClipBoardWrapper>
)

export default ColorToClipBoard
