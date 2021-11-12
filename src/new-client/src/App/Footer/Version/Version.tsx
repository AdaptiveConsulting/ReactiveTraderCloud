import { FC, useState, useEffect } from "react"
import { Wrapper, Link } from "./styled"

type IdentifierType = "release" | "commit"

const getGitResource = async (
  identifier: string,
  type: IdentifierType,
): Promise<string | undefined> => {
  try {
    const response = await fetch(
      type === "release"
        ? "https://api.github.com/repos/AdaptiveConsulting/ReactiveTraderCloud/releases"
        : `https://api.github.com/repos/AdaptiveConsulting/ReactiveTraderCloud/commits/${identifier}`,
    )
    const data = await response.json()

    if (type === "release") {
      const exists = data.find(
        (element: any) => element.tag_name === identifier,
      )
      return exists
        ? `https://github.com/AdaptiveConsulting/ReactiveTraderCloud/releases/tag/${identifier}`
        : undefined
    } else {
      return data.html_url
    }
  } catch (error) {
    console.error(error)
  }
}

export const Version: FC = () => {
  const [gitResource, setGitResource] = useState<string>()

  const rawBuildIdentifier =
    (import.meta.env.VITE_BUILD_VERSION as string) || ""
  const identifierType: IdentifierType =
    rawBuildIdentifier.startsWith("v") && rawBuildIdentifier.length !== 40
      ? "release"
      : "commit"
  const buildIdentifier =
    identifierType === "commit"
      ? rawBuildIdentifier.substr(0, 7)
      : rawBuildIdentifier

  useEffect(() => {
    if (buildIdentifier && identifierType) {
      getGitResource(buildIdentifier, identifierType).then((resource) =>
        setGitResource(resource),
      )
    }
  }, [buildIdentifier, identifierType])

  if (!buildIdentifier) {
    return null
  }

  return (
    <Wrapper>
      {gitResource ? (
        <Link target="_blank" href={gitResource} rel="noreferrer">
          {buildIdentifier}
        </Link>
      ) : (
        <p>{buildIdentifier}</p>
      )}
    </Wrapper>
  )
}
