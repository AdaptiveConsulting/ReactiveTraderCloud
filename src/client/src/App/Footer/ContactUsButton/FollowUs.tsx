import { SOCIAL_ADDRESSES, SocialPlatform } from "@/constants"

import { ContactUsContentResolver, Link } from "./styled"

export const FollowUs = () => {
  const onClick = (social: SocialPlatform) => () => {
    window.gtag("event", "outbound_click", {
      destination: SOCIAL_ADDRESSES[social],
    })
    window.open(SOCIAL_ADDRESSES[social])
  }

  return (
    <ContactUsContentResolver>
      <span className="header">Follow us on</span>
      <div>
        <span>LinkedIn</span>
        <Link onClick={onClick("LinkedIn")}>
          linkedin.com/company/{<br />}adaptive-consulting-ltd/
        </Link>
      </div>
      <div>
        <span>Twitter</span>
        <Link onClick={onClick("Twitter")}>@WeAreAdaptive</Link>
      </div>
      <div>
        <span>Github</span>
        <Link onClick={onClick("Github")}>github.com/adaptiveConsulting</Link>
      </div>
    </ContactUsContentResolver>
  )
}
