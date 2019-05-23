import React, { FC, MouseEvent, ReactNode } from 'react'

interface Props {
  href: string
  children: ReactNode
  className?: string
}

const OpenFinBrowserLink: FC<Props> = props => (
  <a
    {...props}
    onClick={(e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      fin.System.openUrlWithBrowser(e.currentTarget.href)
    }}
  />
)

export default OpenFinBrowserLink
