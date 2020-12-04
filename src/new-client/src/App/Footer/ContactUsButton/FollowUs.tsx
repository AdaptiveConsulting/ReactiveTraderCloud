import { ContactUsContentResolver, Link } from "./styled"

const LINKEDIN_URL = "https://www.linkedin.com/company/adaptive-consulting-ltd/"
const TWITTER_URL = "https://twitter.com/WeAreAdaptive"
const GITHUB_URL = "https://github.com/adaptiveConsulting/"

export const FollowUs: React.FC = () => {
  const onClick = (href: string) => () => {
    window.open(href)
  }

  return (
    <ContactUsContentResolver>
      <span className="header">Follow us on</span>
      <div>
        <span>LinkedIn</span>
        <Link onClick={onClick(LINKEDIN_URL)}>
          linkedin.com/company/{<br />}adaptive-consulting-ltd/
        </Link>
      </div>
      <div>
        <span>Twitter</span>
        <Link onClick={onClick(TWITTER_URL)}>@WeAreAdaptive</Link>
      </div>
      <div>
        <span>Github</span>
        <Link onClick={onClick(GITHUB_URL)}>github.com/adaptiveConsulting</Link>
      </div>
    </ContactUsContentResolver>
  )
}
