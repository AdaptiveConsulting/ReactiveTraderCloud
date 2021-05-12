import { useRef, useState, useEffect } from "react"
import styled from "styled-components"
import { useConnectionStatus } from "@/services/connection"
import { StatusCircle, StatusLabel } from "./styled"
import { Root, Button } from "../common-styles"

const APP_VERSION = import.meta.env.VITE_APP_VERSION as string

export const Wrapper = styled.div`
  color: ${(props) => props.theme.textColor};
  opacity: 0.59;
  font-size: 0.75rem;
`
export const Link = styled.a`
  color: inherit;
  text-decoration: inherit;
`

const gitTagExists = async (gitTag: string | undefined) => {
  const response = await fetch(
    "https://api.github.com/repos/AdaptiveConsulting/ReactiveTraderCloud/releases",
  )

  try {
    const data = await response.json()
    return data.find((element: any) => element.tag_name === gitTag)
  } catch (error) {
    console.error(error)
    return false
  }
}

export const FooterVersion: React.FC = () => {
  const [versionExists, setVersionExists] = useState<boolean | void>(false)

  const URL =
    "https://github.com/AdaptiveConsulting/ReactiveTraderCloud/releases/tag/" +
    APP_VERSION

  useEffect(() => {
    gitTagExists(APP_VERSION).then((resolution) => setVersionExists(resolution))
  }, [])

  return (
    <Wrapper>
      {versionExists ? (
        <Link target="_blank" href={URL}>
          {APP_VERSION}
        </Link>
      ) : (
        <p>{APP_VERSION}</p>
      )}
    </Wrapper>
  )
}

export const StatusButton: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null)

  const appStatus = useConnectionStatus()
  return (
    <Root ref={ref}>
      <Button disabled>
        <StatusCircle status={appStatus} />
        <StatusLabel>
          {appStatus[0].toUpperCase() + appStatus.slice(1).toLowerCase()}
        </StatusLabel>
      </Button>
    </Root>
  )
}
