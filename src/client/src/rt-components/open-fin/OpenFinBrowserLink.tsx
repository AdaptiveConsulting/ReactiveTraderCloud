import React, { FC, MouseEvent, ReactNode } from 'react'

interface Props {
  href: string
  children: ReactNode
  className?: string
}

const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault()
  /* eslint-disable-next-line */
  fin.System.openUrlWithBrowser(e.currentTarget.href)
}

const OpenFinBrowserLink: FC<Props> = props => <a {...props} onClick={handleClick} />

export default OpenFinBrowserLink
