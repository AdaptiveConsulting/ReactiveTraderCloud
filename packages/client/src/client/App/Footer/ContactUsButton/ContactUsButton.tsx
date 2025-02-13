import { useRef } from "react"

import { Button } from "@/client/components/Button"
import Logo from "@/client/components/logos/AdaptiveLogo"
import { usePopUpMenu } from "@/client/utils/usePopUpMenu"

import { Root } from "../common-styles"
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
        variant="primary"
        size="sm"
        onClick={() => setDisplayMenu((prev) => !prev)}
        data-qa="contact-us-button"
      >
        {/* <MailIcon height="1" width="1" active={displayMenu} /> TODO: Refactor button to allow icons */}
        Get in touch
      </Button>

      <ContactUsPopup open={displayMenu} minWidth={"14rem"}>
        <ContactUsPopupContent logoSize={1.25} />
      </ContactUsPopup>
    </Root>
  )
}

export default ContactUsButton
