import React from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { styled } from 'rt-theme'
import CopyToClipboard from 'react-copy-to-clipboard'

library.add(faCopy)

interface ColorToClipboardProps {
  color: string
  iconColor: string
}
export const CopyToClipboardWrapper = styled.div`
  position: absolute;
  padding: inherit;
  top: 0;
  right: 0;
  visibility: hidden;
  transition: visibility 0.1s;
`
const onClick = () => {
  alert('copied to clipboard')
}
const ColorToClipboard: React.FC<ColorToClipboardProps> = ({ color, iconColor }) => (
  <CopyToClipboardWrapper>
    <CopyToClipboard text={color}>
      <button onClick={onClick}>
        <FontAwesomeIcon icon="copy" style={{ color: iconColor }} />
      </button>
    </CopyToClipboard>
  </CopyToClipboardWrapper>
)

export default ColorToClipboard
