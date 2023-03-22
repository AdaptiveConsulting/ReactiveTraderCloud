import { useRef } from "react"

import { MailIcon } from "@/components/icons"
import Logo from "@/components/Logo"
import { usePopUpMenu } from "@/utils/usePopUpMenu"

import { Button, Root } from "../common-styles"
import { ContactUs } from "./ContactUs"
import { FollowUs } from "./FollowUs"
import { ContactUsPopup, LogoWrapper } from "./styled"

interface Props {
  logoSize: number
}

export const ContactUsPopupContent = ({ logoSize }: Props) => (
  <>
    <ContactUs />
    <FollowUs />
    <LogoWrapper>
      <Logo size={logoSize} />
    </LogoWrapper>
  </>
)

const ContactUsButton = () => {
  const ref = useRef<HTMLDivElement>(null)
  const { displayMenu, setDisplayMenu } = usePopUpMenu(ref)

  return (
    <Root ref={ref}>
      <Button
        onClick={() => setDisplayMenu((prev) => !prev)}
        data-qa="contact-us-button"
        margin={"0 0.7rem 0 0"}
      >
        <MailIcon height="1" width="1" active={displayMenu} />
        Get in touch
      </Button>

      <ContactUsPopup open={displayMenu} minWidth={"14rem"}>
        <ContactUsPopupContent logoSize={1.25} />
      </ContactUsPopup>
    </Root>
  )
}

export default ContactUsButton
