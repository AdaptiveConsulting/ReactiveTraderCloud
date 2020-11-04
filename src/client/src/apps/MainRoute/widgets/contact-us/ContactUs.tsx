import React, { useCallback } from 'react'
import { ContactUsContentResolver, Link, Input } from './styled'
import { handleBrowserLink } from './utils'
import { EventArgs } from 'react-ga'

const WEBSITE = 'https://weareadaptive.com'

const ContactUs: React.FC = () => {
  const onClick = useCallback(
    (args: EventArgs, href: string) => () => {
      handleBrowserLink(args, href)
    },
    []
  )
  return (
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
        onClick={onClick(
          {
            category: 'RT - Outbound',
            action: 'click',
            label: WEBSITE,
            transport: 'beacon'
          },
          WEBSITE
        )}
      >
        www.weareadaptive.com
      </Link>
    </ContactUsContentResolver>
  )
}

export default ContactUs

/*
  ca
*/
