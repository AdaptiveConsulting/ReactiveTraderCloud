import { MouseEvent, ReactNode } from "react"

interface Props {
  href: string
  children: ReactNode
  className?: string
}

const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault()
  fin.System.openUrlWithBrowser(e.currentTarget.href)
}

const OpenFinBrowserLink = ({ children, ...props }: Props) => (
  <a {...props} onClick={handleClick}>
    {children}
  </a>
)

export default OpenFinBrowserLink
