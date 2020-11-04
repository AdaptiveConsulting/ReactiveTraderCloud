import React, { useCallback } from 'react'
import { Root, Button } from '../../../apps/MainRoute/widgets/status-connection/styled'
import { MailIcon } from 'rt-components'
import { createOpenFinPopup, Offset, showOpenFinPopup } from './utils';
import { ContactUsPopupContent } from 'apps/MainRoute/widgets/contact-us/ContactUsButton';
import { Background } from './OpenFinStatusConnection/styled';

export const OpenFinContactDisplay = () =>
  <Background>
    <ContactUsPopupContent logoSize={2} />
  </Background>

const OpenFinContactButton: React.FC = () => {
  const [showing, setShowing] = React.useState(false);

  const baseWin = { name: 'openfin-contact-popup', height: 445, width: 245 }
  const offset: Offset = [130, 40]
  const URL = '/contact';

  const showPopup = useCallback(() => {
    if (!showing) {
      setShowing(true)
      showOpenFinPopup(baseWin, offset)
    }
  }, [baseWin, offset, showing])

  React.useEffect(() => { createOpenFinPopup(baseWin, URL, () => setShowing(false)) }, [baseWin]);

  return (
    <Root>
      <Button onMouseDown={showPopup} data-qa="contact-us-button" margin={'0 0.7rem 0 0'}>
        <MailIcon size={1} active={false} />
        Get in touch
      </Button>
    </Root>
  )
}

export default OpenFinContactButton
