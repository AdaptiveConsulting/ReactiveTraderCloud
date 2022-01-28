import { useLayoutEffect } from "react"

export const DocTitle: React.FC<{ title: string }> = ({ title, children }) => {
  useLayoutEffect(() => {
    document.title = title
  }, [title])

  return <>{children}</>
}
