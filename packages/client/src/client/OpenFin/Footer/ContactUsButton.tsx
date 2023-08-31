import {
  Background,
  Button as OpenFinButton,
} from "client/App/Footer/common-styles"
import { ContactUs } from "client/App/Footer/ContactUsButton/ContactUs"
import { FollowUs } from "client/App/Footer/ContactUsButton/FollowUs"
import { LogoWrapper } from "client/App/Footer/ContactUsButton/styled"
import { MailIcon } from "client/components/icons"
import Logo from "client/components/Logo"
import {
  createOpenFinPopup,
  showOpenFinPopup,
} from "client/OpenFin/utils/window"
import { constructUrl } from "@/client/utils/constructUrl"
import { useEffect, useState } from "react"
import styled from "styled-components"

const Wrapper = styled(Background)`
  &&& {
    font-size: 1rem;

    .header {
      font-size: 1.25rem;
    }

    span {
      font-size: 1rem;
      line-height: 1.25;
    }
  }
`

const Button = styled(OpenFinButton)`
  margin: "0 0.7rem 0 0";
  &:hover {
    [fill] {
      fill: ${({ theme }) => theme.accents.primary.base};
    }
  }
`

export const OpenFinContactDisplay = () => (
  <Wrapper>
    <ContactUs />
    <FollowUs />
    <LogoWrapper>
      <Logo size={2} />
    </LogoWrapper>
  </Wrapper>
)

const baseWin = { name: "contact", height: 445, width: 245 }
const pathname = constructUrl("/contact")

const ContactUsButton = () => {
  const [showing, setShowing] = useState(false)

  const showPopup = () => {
    if (!showing) {
      setShowing(true)
      showOpenFinPopup(baseWin, [100, 40])
    }
  }

  useEffect(() => {
    createOpenFinPopup(baseWin, pathname, () => setShowing(false))
  }, [])

  return (
    <Button onClick={showPopup} data-qa="contact-us-button">
      <MailIcon height="1" width="1" active={showing} />
      Get in touch
    </Button>
  )
}

export default ContactUsButton
