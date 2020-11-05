import React, { FC, useState } from 'react'
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
const FooterVersion: FC = () => {
  const [versionExists, setVersionExists] = useState<boolean | void>(false)
  const gitTagExists = async (gitTag: string | undefined) => {
    const exists = await fetch(
      'https://api.github.com/repos/AdaptiveConsulting/ReactiveTraderCloud/releases'
    )
      .then(response => response.json())
      .then(data => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].tag_name === gitTag) {
            return true
          }
        }
        return false
      })
      .catch(error => console.error(error))
    setVersionExists(exists)
  }

  let currentVersion: string | undefined = process.env.REACT_APP_VERSION
  gitTagExists(currentVersion)

  const URL =
    'https://github.com/AdaptiveConsulting/ReactiveTraderCloud/releases/tag/' +
    process.env.REACT_APP_VERSION

  return (
    <Wrapper>
      {versionExists ? (
        <Link target="_blank" href={URL}>
          {process.env.REACT_APP_VERSION}
        </Link>
      ) : (
        <p>{process.env.REACT_APP_VERSION}</p>
      )}
    </Wrapper>
  )
}
export default FooterVersion
