import { PropsWithChildren } from "react"

import { Gap } from "@/client/components/Gap"
import { Typography } from "@/client/components/Typography"
import { SOCIAL_ADDRESSES, SocialPlatform } from "@/client/constants"

import { ContactUsContentResolver, Link } from "./styled"

const Row = ({
  children,
  label,
  onClick,
}: PropsWithChildren<{ onClick: () => void; label: string }>) => (
  <>
    <Typography variant="Text md/Regular">{label}</Typography>
    <Link
      variant="Text sm/Regular"
      color="Component colors/Utility/Blue dark/utility-blue-dark-500"
      onClick={onClick}
    >
      {children}
    </Link>
    <Gap height="md" />
  </>
)
export const FollowUs = () => {
  const onClick = (social: SocialPlatform) => () => {
    window.gtag("event", "outbound_click", {
      destination: SOCIAL_ADDRESSES[social],
    })
    window.open(SOCIAL_ADDRESSES[social])
  }

  return (
    <ContactUsContentResolver>
      <Typography variant="Text lg/Regular">Follow us on</Typography>
      <Gap height="sm" />
      <Row label="LinkedIn" onClick={onClick("LinkedIn")}>
        linkedin.com/company/{<br />}adaptive-consulting-ltd/
      </Row>
      <Row label="Twitter" onClick={onClick("Twitter")}>
        @WeAreAdaptive
      </Row>
      <Row label="Github" onClick={onClick("Github")}>
        github.com/adaptiveConsulting
      </Row>
    </ContactUsContentResolver>
  )
}
