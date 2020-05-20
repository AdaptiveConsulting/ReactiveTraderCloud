import React, { useCallback, useRef } from 'react'
import { Root, Button } from '../status-connection/styled'
import { ContactUsPopup, LogoWrapper } from './styled'
import ContactUs from './ContactUs'
import FollowUs from './FollowUs'
import Logo from '../../components/app-header/Logo'
import { MailIcon } from 'rt-components'
import { usePopUpMenu } from 'rt-util'

const ContactUsButton: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null)
  const { displayMenu, setDisplayMenu } = usePopUpMenu(ref)

  const toggleMenu = useCallback(() => {
    setDisplayMenu(!displayMenu)
  }, [displayMenu, setDisplayMenu])

  return (
    <Root ref={ref}>
      <Button onClick={toggleMenu} data-qa="contact-us-button" margin={'0 0.7rem 0 0'}>
        <MailIcon size={1} active={displayMenu} />
        Get in touch
      </Button>

      <ContactUsPopup open={displayMenu} minWidth={'14rem'}>
        <ContactUs />
        <FollowUs />
        <LogoWrapper>
          <Logo size={1.25} />
        </LogoWrapper>
      </ContactUsPopup>
    </Root>
  )
}

export default ContactUsButton
