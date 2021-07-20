import { MailIcon } from "@/App/Footer/ContactUsButton/MailIcon"
import { Button, Root, Background } from "@/App/Footer/common-styles"
import { createOpenFinPopup, showOpenFinPopup } from "@/OpenFin/utils/window"
import { useMemo, useCallback, useEffect, useState } from "react"
import { ContactUs } from "@/App/Footer/ContactUsButton/ContactUs"
import { FollowUs } from "@/App/Footer/ContactUsButton/FollowUs"
import { LogoWrapper } from "@/App/Footer/ContactUsButton/styled"
import Logo from "@/components/Logo"
import styled from "styled-components"

const Wrapper = styled.div`
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

export const OpenFinContactDisplay = () => (
  <Background>
    <Wrapper>
      <ContactUs />
      <FollowUs />
      <LogoWrapper>
        <Logo size={2} />
      </LogoWrapper>
    </Wrapper>
  </Background>
)

const ContactUsButton: React.FC = () => {
  const [showing, setShowing] = useState(false)

  const baseWin = useMemo(
    () => ({ name: "contact", height: 445, width: 245 }),
    [],
  )
  const pathname = "/contact"

  const showPopup = useCallback(() => {
    if (!showing) {
      setShowing(true)
      showOpenFinPopup(baseWin, [100, 40])
    }
  }, [baseWin, showing])

  useEffect(() => {
    createOpenFinPopup(baseWin, pathname, () => setShowing(false))
  }, [baseWin])

  return (
    <Root>
      <Button
        onMouseDown={showPopup}
        data-qa="contact-us-button"
        margin={"0 0.7rem 0 0"}
      >
        <MailIcon size={1} active={false} />
        Get in touch
      </Button>
    </Root>
  )
}

export default ContactUsButton
