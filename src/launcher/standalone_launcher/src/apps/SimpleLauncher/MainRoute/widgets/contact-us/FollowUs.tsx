import React, { useCallback } from 'react'
import { ContactUsContentResolver, Link } from './styled'
import { handleBrowserLink } from './utils'
import { EventArgs } from 'react-ga'

const LINKEDIN_URL = 'https://www.linkedin.com/company/adaptive-consulting-ltd/'
const TWITTER_URL = 'https://twitter.com/WeAreAdaptive'
const GITHUB_URL = 'https://github.com/adaptiveConsulting/'

const FollowUs: React.FC = () => {
  const onClick = useCallback(
    (args: EventArgs, href: string) => () => {
      handleBrowserLink(args, href)
    },
    []
  )
  return (
    <ContactUsContentResolver>
      <span className="header">Follow us on</span>
      <div>
        <span>LinkedIn</span>
        <Link
          onClick={onClick(
            { category: 'RT - Social', action: 'click', label: 'LinkedIn (url)' },
            LINKEDIN_URL
          )}
        >
          linkedin.com/company/{<br />}adaptive-consulting-ltd/
        </Link>
      </div>
      <div>
        <span>Twitter</span>
        <Link
          onClick={onClick(
            { category: 'RT - Social', action: 'click', label: 'Twitter (url)' },
            TWITTER_URL
          )}
        >
          @WeAreAdaptive
        </Link>
      </div>
      <div>
        <span>Github</span>
        <Link
          onClick={onClick(
            { category: 'RT - Social', action: 'click', label: 'Github (url)' },
            GITHUB_URL
          )}
        >
          github.com/adaptiveConsulting
        </Link>
      </div>
    </ContactUsContentResolver>
  )
}

export default FollowUs
