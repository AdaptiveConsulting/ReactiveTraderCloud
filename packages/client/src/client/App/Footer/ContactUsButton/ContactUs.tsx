import { PropsWithChildren } from "react"

import { Gap } from "@/client/components/Gap"
import { Typography } from "@/client/components/Typography"
import { EMAIL, WEBSITE } from "@/client/constants"

import { ContactUsContentResolver, Link } from "./styled"

const Row = ({ children }: PropsWithChildren) => (
  <>
    <Typography variant="Text sm/Regular">{children}</Typography>
    <Gap height="sm" />
  </>
)

export const ContactUs = () => (
  <ContactUsContentResolver>
    <Typography variant="Text lg/Regular">Contact us</Typography>
    <Gap height="md" />
    <Row>2nd floor, 1 Lackington St, London, EC2A 1AL</Row>
    <Row>+44 203 725 6000</Row>
    <Row>530 7th Avenue, New York</Row>
    <Row>+1 929 205 4900</Row>

    <Link
      variant="Text sm/Regular underlined"
      color="Component colors/Utility/Blue dark/utility-blue-dark-500"
      onClick={() => {
        window.open(`mailto:${EMAIL}`)
      }}
    >
      <Typography>{EMAIL}</Typography>
    </Link>
    <Gap height="xs" />

    <Link
      variant="Text sm/Regular underlined"
      color="Component colors/Utility/Blue dark/utility-blue-dark-500"
      onClick={() => {
        window.gtag("event", "outbound_click", {
          destination: WEBSITE,
        })
        window.open(WEBSITE)
      }}
    >
      www.weareadaptive.com
    </Link>
  </ContactUsContentResolver>
)
