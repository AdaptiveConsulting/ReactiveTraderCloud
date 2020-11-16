import { useState } from 'react'

export type ForceUpdateFn = () => void

export function useForceUpdate(): ForceUpdateFn {
  const [value, setValue] = useState<boolean>(false)
  return () => setValue(!value)
}
