import React from "react"
import { ContactUsContentResolver, Link, Input } from "./styled"

const WEBSITE = "https://weareadaptive.com"

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

    <Input value="sales@weareadaptive.com" readOnly />

    <Link
      onClick={() => {
        window.open(WEBSITE)
      }}
    >
      www.weareadaptive.com
    </Link>
  </ContactUsContentResolver>
)
