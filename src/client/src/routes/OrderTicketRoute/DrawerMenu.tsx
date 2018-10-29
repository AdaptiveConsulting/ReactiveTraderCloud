import React, { PureComponent } from 'react'
import { styled } from 'rt-theme'
import { Block } from '../StyleguideRoute/styled'

import { faCog, faKeyboard, faMicrophone, faPhone, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export class DrawerMenu extends PureComponent<{ onClick?: (e: any) => any }> {
  render() {
    const { onClick } = this.props
    return (
      <React.Fragment>
        <Block display="inline" fg="secondary.base" onClick={onClick}>
          <FontAwesomeIcon icon={faMicrophone} />
        </Block>
        <FontAwesomeIcon icon={faKeyboard} />
        <FontAwesomeIcon icon={faPhone} />
        <AutoFill />
        <FontAwesomeIcon icon={faCog} />
        <FontAwesomeIcon icon={faUser} />
      </React.Fragment>
    )
  }
}

const AutoFill = styled(Block)`
  fill: 1 1 100%;
  min-height: 1rem;
  max-height: 100%;
`
