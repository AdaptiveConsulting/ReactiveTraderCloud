import { PropsWithChildren } from "react"

import { Typography } from "@/client/components/Typography"
import { SOCIAL_ADDRESSES, SocialPlatform } from "@/client/constants"

import { ContactUsContentResolver } from "./styled"

const Row = ({
  children,
  label,
}: PropsWithChildren<{ label: SocialPlatform }>) => (
  <>
    <Typography variant="Text md/Regular">{label}</Typography>
    <Typography
      as="a"
      href={SOCIAL_ADDRESSES[label]}
      target="_blank"
      variant="Text sm/Regular underlined"
      color="Component colors/Utility/Blue dark/utility-blue-dark-500"
      paddingBottom="md"
      onClick={() => {
        window.gtag("event", "outbound_click", {
          destination: SOCIAL_ADDRESSES[label],
        })
      }}
    >
      {children}
    </Typography>
  </>
)
export const FollowUs = () => {
  return (
    <ContactUsContentResolver>
      <Typography variant="Text lg/Regular">Follow us on</Typography>
      <Row label="LinkedIn">
        linkedin.com/company/{<br />}adaptive-consulting-ltd/
      </Row>
      <Row label="Twitter">@WeAreAdaptive</Row>
      <Row label="Github">github.com/adaptiveConsulting</Row>
    </ContactUsContentResolver>
  )
}
