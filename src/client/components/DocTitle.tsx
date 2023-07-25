import { ReactNode, useLayoutEffect } from "react"

export const DocTitle = ({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) => {
  useLayoutEffect(() => {
    document.title = title
  }, [title])

  return <>{children}</>
}
