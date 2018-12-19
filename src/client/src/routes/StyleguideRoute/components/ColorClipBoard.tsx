import React from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { styled } from 'rt-theme'

library.add(faCopy)
import CopyToClipboard from 'react-copy-to-clipboard'

interface ColorClipBoardProps {
  color: string
}
export const ClipBoardWrapper = styled.div`
  visibility: hidden;
`

const onClick = () => {
  alert('copied to clipboard')
}

class ColorClipBoard extends React.Component<ColorClipBoardProps> {
  render() {
    return (
      <ClipBoardWrapper>
        <CopyToClipboard text={this.props.color}>
          <button onClick={onClick}>
            <FontAwesomeIcon icon="copy" />
          </button>
        </CopyToClipboard>
      </ClipBoardWrapper>
    )
  }
}

export default ColorClipBoard
