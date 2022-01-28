import { ContactUsContentResolver, Link } from "./styled"

type Social = "Twitter" | "LinkedIn" | "Github"
const config: Record<Social, string> = {
  Twitter: "https://twitter.com/WeAreAdaptive",
  LinkedIn: "https://www.linkedin.com/company/adaptive-consulting-ltd/",
  Github: "https://github.com/adaptiveConsulting/",
}

export const FollowUs: React.FC = () => {
  const onClick = (social: Social) => () => {
    window.ga("send", "event", "RT - Social", "click", `${social} (url)`)
    window.open(config[social])
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
