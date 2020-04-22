import React, { useCallback } from 'react'
import { ContactUsContent, Link } from './styled'
import ReactGA from 'react-ga'

const SALES_EMAIL = 'mailto:sales@weareadaptive.com'
const WEBSITE = 'https://weareadaptive.com'

const ContactUs: React.FC = () => {
  const onClick = useCallback(
    (args: ReactGA.EventArgs, href: string) => () => {
      ReactGA.event(args)
      window.open(href)
    },
    [],
  )
  return (
    <ContactUsContent>
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
        onClick={onClick(
          {
            category: 'Contact Link',
            action: 'click',
            label: 'Sales Email Link',
          },
          SALES_EMAIL,
        )}
      >
        sales@weareadaptive.com
      </Link>
      <Link
        onClick={onClick(
          {
            category: 'RT - Outbound',
            action: 'click',
            label: WEBSITE,
            transport: 'beacon',
          },
          WEBSITE,
        )}
      >
        www.weareadaptive.com
      </Link>
    </ContactUsContent>
  )
}

export default ContactUs

/*
  ca
*/
