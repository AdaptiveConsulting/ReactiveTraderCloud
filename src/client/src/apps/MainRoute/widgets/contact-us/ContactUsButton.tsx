import React, { useCallback, useState } from 'react'
import { Root, Button } from '../status-connection/styled'
import { ContactUsPopup, LogoWrapper } from './styled'
import ContactUs from './ContactUs'
import FollowUs from './FollowUs'
import Logo from '../../components/app-header/Logo'

const ContactUsButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const toggleOpen = useCallback(() => {
    setIsOpen(!isOpen)
  }, [isOpen, setIsOpen])

  return (
    <Root>
      <Button onClick={toggleOpen} data-qa="contact-us-button" margin={'0 0.7rem 0 0'}>
        Get in touch
      </Button>

      <ContactUsPopup open={isOpen} onClick={toggleOpen} minWidth={'14rem'}>
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
