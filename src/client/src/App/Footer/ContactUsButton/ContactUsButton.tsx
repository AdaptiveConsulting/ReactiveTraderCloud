import { useRef } from "react"
import { ContactUsPopup, LogoWrapper } from "./styled"
import { ContactUs } from "./ContactUs"
import { FollowUs } from "./FollowUs"
import Logo from "@/components/Logo"
import { MailIcon } from "./MailIcon"
import { usePopUpMenu } from "@/utils/usePopUpMenu"
import { Button, Root } from "../common-styles"

interface Props {
  logoSize: number
}

export const ContactUsPopupContent: React.FC<Props> = ({ logoSize }) => (
  <>
    <ContactUs />
    <FollowUs />
    <LogoWrapper>
      <Logo size={logoSize} />
    </LogoWrapper>
  </>
)

const ContactUsButton: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null)
  const { displayMenu, setDisplayMenu } = usePopUpMenu(ref)

  return (
    <Root ref={ref}>
      <Button
        onClick={() => setDisplayMenu((prev) => !prev)}
        data-qa="contact-us-button"
        margin={"0 0.7rem 0 0"}
      >
        <MailIcon size={1} active={displayMenu} />
        Get in touch
      </Button>

      <ContactUsPopup open={displayMenu} minWidth={"14rem"}>
        <ContactUsPopupContent logoSize={1.25} />
      </ContactUsPopup>
    </Root>
  )
}

export default ContactUsButton
