import { ContactUsContentResolver, Link } from "./styled"

const WEBSITE = "https://weareadaptive.com"
const EMAIL = "sales@weareadaptive.com"

export const ContactUs: React.FC = () => (
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
        window.ga("send", "event", "RT - Outbound", "click", WEBSITE)
        window.open(WEBSITE)
      }}
    >
      www.weareadaptive.com
    </Link>
  </ContactUsContentResolver>
)
