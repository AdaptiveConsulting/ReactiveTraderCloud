import { useEffect, useState } from "react"
import styled from "styled-components"

import { Background } from "@/client/App/Footer/common-styles"
import { ContactUs } from "@/client/App/Footer/ContactUsButton/ContactUs"
import { FollowUs } from "@/client/App/Footer/ContactUsButton/FollowUs"
import { LogoWrapper } from "@/client/App/Footer/ContactUsButton/styled"
import { Button } from "@/client/components/Button"
import Logo from "@/client/components/logos/AdaptiveLogo"
import {
  createOpenFinPopup,
  showOpenFinPopup,
} from "@/client/OpenFin/utils/window"
import { constructUrl } from "@/client/utils/constructUrl"

const Wrapper = styled(Background)``

export const OpenFinContactDisplay = () => (
  <Wrapper>
    <ContactUs />
    <FollowUs />
    <LogoWrapper>
      <Logo size={2} />
    </LogoWrapper>
  </Wrapper>
)

const baseWin = { name: "contact", height: 375, width: 245 }
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
    <Button variant="primary" size="sm" onClick={showPopup}>
      {/* <MailIcon height="1" width="1" active={showing} /> TODO add icon support to button component */}
      Get in touch
    </Button>
  )
}

export default ContactUsButton
