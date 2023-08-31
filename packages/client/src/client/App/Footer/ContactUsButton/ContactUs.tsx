import { EMAIL, WEBSITE } from "@/client/constants"

import { ContactUsContentResolver, Link } from "./styled"

export const ContactUs = () => (
  <ContactUsContentResolver>
    <span className="header">Contact us</span>
    <div>
      <span>70 St. Mary Axe, London, EC3A 8BE</span>
      <span>+44 203 725 6000</span>
    </div>
    <div>
      <span>530 7th Avenue, New York</span>
      <span>+1 929 205 4900</span>
    </div>

    <Link
      onClick={() => {
        window.open(`mailto:${EMAIL}`)
      }}
    >
      {EMAIL}
    </Link>

    <Link
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
