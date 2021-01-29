import React, { FC, useState, useEffect } from 'react'
import styled from 'styled-components/macro'

export const Wrapper = styled.div`
  color: ${props => props.theme.textColor};
  opacity: 0.59;
  font-size: 0.75rem;
`
export const Link = styled.a`
  color: inherit;
  text-decoration: inherit;
`

const gitTagExists = async (gitTag: string | undefined) => {
  try {
    const response = await fetch(
      'https://api.github.com/repos/AdaptiveConsulting/ReactiveTraderCloud/releases'
    )
    const data = await response.json()
    const exists = data.find((element: any) => element.tag_name === gitTag)
    return exists
  } catch (error) {
    console.error(error)
  }
}

const FooterVersion: FC = () => {
  const [versionExists, setVersionExists] = useState<boolean | void>(false)

  const URL =
    'https://github.com/AdaptiveConsulting/ReactiveTraderCloud/releases/tag/' +
    process.env.REACT_APP_BUILD_VERSION

  useEffect(() => {
    gitTagExists(process.env.REACT_APP_BUILD_VERSION).then(resolution =>
      setVersionExists(resolution)
    )
  }, [])

  return (
    <Wrapper>
      {versionExists ? (
        <Link target="_blank" href={URL}>
          {process.env.REACT_APP_BUILD_VERSION}
        </Link>
      ) : (
        <p>{process.env.REACT_APP_BUILD_VERSION}</p>
      )}
    </Wrapper>
  )
}
export default FooterVersion
