import { useEffect, useState } from "react"
import styled from "styled-components"

import { Background, Button as OpenFinButton } from "@/App/Footer/common-styles"
import { ContactUs } from "@/App/Footer/ContactUsButton/ContactUs"
import { FollowUs } from "@/App/Footer/ContactUsButton/FollowUs"
import { MailIcon } from "@/App/Footer/ContactUsButton/MailIcon"
import { LogoWrapper } from "@/App/Footer/ContactUsButton/styled"
import Logo from "@/components/Logo"
import { createOpenFinPopup, showOpenFinPopup } from "@/OpenFin/utils/window"
import { constructUrl } from "@/utils/url"

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
      <MailIcon height={1} width={1} active={showing} />
      Get in touch
    </Button>
  )
}

export default ContactUsButton
