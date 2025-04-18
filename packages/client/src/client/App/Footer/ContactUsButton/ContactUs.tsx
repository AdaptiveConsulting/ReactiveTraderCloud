import { PropsWithChildren } from "react"

import { Typography } from "@/client/components/Typography"
import { EMAIL, WEBSITE } from "@/client/constants"

import { ContactUsContentResolver } from "./styled"

const Row = ({ children }: PropsWithChildren) => (
  <>
    <Typography variant="Text sm/Regular" paddingBottom="sm">
      {children}
    </Typography>
  </>
)

export const ContactUs = () => (
  <ContactUsContentResolver>
    <Typography variant="Text lg/Regular" paddingBottom="md">
      Contact us
    </Typography>
    <Row>2nd floor, 1 Lackington St, London, EC2A 1AL</Row>
    <Row>+44 203 725 6000</Row>
    <Row>530 7th Avenue, New York</Row>
    <Row>+1 929 205 4900</Row>

    <Typography
      as="a"
      href={`mailto:${EMAIL}`}
      variant="Text sm/Regular underlined"
      color="Component colors/Utility/Blue dark/utility-blue-dark-500"
      paddingBottom="xs"
    >
      {EMAIL}
    </Typography>

    <Typography
      as="a"
      href={WEBSITE}
      target="_blank"
      variant="Text sm/Regular underlined"
      color="Component colors/Utility/Blue dark/utility-blue-dark-500"
      onClick={() => {
        window.gtag("event", "outbound_click", {
          destination: WEBSITE,
        })
      }}
    >
      www.weareadaptive.com
    </Typography>
  </ContactUsContentResolver>
)
