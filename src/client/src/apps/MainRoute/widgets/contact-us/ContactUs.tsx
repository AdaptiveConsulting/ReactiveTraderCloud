import React from 'react'
import { ContactUsContent, Link } from './styled'

const ContactUs: React.FC = () => (
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

    <Link href="mailto:sales@weareadaptive.com" target="_blank" rel="noopener noreferrer">
      sales@weareadaptive.com
    </Link>
    <Link href="https://weareadaptive.com/" target="_blank" rel="noopener noreferrer">
      www.weareadaptive.com
    </Link>
  </ContactUsContent>
)

export default ContactUs
