import { ExternalWindowProps } from './selectors'

export const createPopOutUrl: (
  externalWindowProps: ExternalWindowProps,
) => ExternalWindowProps = (externalWindowProps) => {
  const { config } = externalWindowProps
  const url = `${config.url}`
  const newConfig = { ...config, url }
  return { ...externalWindowProps, config: newConfig }
}
