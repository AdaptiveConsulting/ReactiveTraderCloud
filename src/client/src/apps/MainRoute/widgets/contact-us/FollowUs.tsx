import React from 'react'
import { ContactUsContent, Link } from './styled'

const FollowUs: React.FC = () => (
  <ContactUsContent>
    <span className="header">Follow us on</span>
    <div>
      <span>LinkedIn</span>
      <Link
        href="https://www.linkedin.com/company/adaptive-consulting-ltd/"
        target="_blank"
        rel="noopener noreferrer"
      >
        linkedin.com/company/{<br />}adaptive-consulting-ltd/
      </Link>
    </div>
    <div>
      <span>Twitter</span>
      <Link href="https://twitter.com/WeAreAdaptive" target="_blank" rel="noopener noreferrer">
        @WeAreAdaptive
      </Link>
    </div>
    <div>
      <span>Github</span>
      <Link href="https://github.com/adaptiveConsulting/" target="_blank" rel="noopener noreferrer">
        github.com/adaptiveConsulting
      </Link>
    </div>
  </ContactUsContent>
)

export default FollowUs
