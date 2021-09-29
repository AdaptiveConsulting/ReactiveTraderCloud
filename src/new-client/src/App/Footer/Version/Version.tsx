import { FC, useState, useEffect } from "react"
import { Wrapper, Link } from "./styled"

const gitTagExists = async (gitTag: string | undefined) => {
  try {
    const response = await fetch(
      "https://api.github.com/repos/AdaptiveConsulting/ReactiveTraderCloud/releases",
    )
    const data = await response.json()
    const exists = data.find((element: any) => element.tag_name === gitTag)
    return exists
  } catch (error) {
    console.error(error)
  }
}

export const Version: FC = () => {
  const [versionExists, setVersionExists] = useState<boolean | void>(false)

  const buildVersion = import.meta.env.VITE_BUILD_VERSION as string
  const URL =
    "https://github.com/AdaptiveConsulting/ReactiveTraderCloud/releases/tag/" +
    buildVersion

  useEffect(() => {
    if (buildVersion) {
      gitTagExists(buildVersion).then((resolution) =>
        setVersionExists(resolution),
      )
    }
  }, [buildVersion])

  if (!buildVersion) {
    return null
  }

  return (
    <Wrapper>
      {versionExists ? (
        <Link target="_blank" href={URL}>
          {buildVersion}
        </Link>
      ) : (
        <p>{buildVersion}</p>
      )}
    </Wrapper>
  )
}
