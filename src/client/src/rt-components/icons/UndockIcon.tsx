import React from 'react'
import { IconStateTypes } from './types'
interface Props {
  width: number
  height: number
  iconState: IconStateTypes
}

const UndockIcon: React.FC<Props> = props => {
  const { width, height, iconState } = props

  const IconState = {
    [IconStateTypes.Normal]: {
      pathFillFirst: "#7E8188",
      pathFillSecond: "#535760"
    },
    [IconStateTypes.Hover]: {
      pathFillFirst: "#5F94F5",
      pathFillSecond: "#535760"
    },
    [IconStateTypes.Disabled]: {
      pathFillFirst: "#535760",
      pathFillSecond: "#3D424C"
    }
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24">
      <g fill="none" fillRule="evenodd">
        <path d="M0 0H24V24H0z" />
        <path fill={IconState[iconState].pathFillFirst} d="M18 5a2 2 0 012 2v4h-6V5h4zm-3 5h4V7a1 1 0 00-.883-.993L18 6h-3v4z" />
        <path fill={IconState[iconState].pathFillSecond} d="M5 9a2 2 0 012-2h5v6h6v4a3 3 0 01-3 3H7a2 2 0 01-2-2V9zm6 5H6v4a1 1 0 00.883.993L7 19h4v-5zm6 0h-5v5h3a2 2 0 001.995-1.85L17 17v-3zm-6-6H7a1 1 0 00-.993.883L6 9v4h5V8z" />
      </g>
    </svg>
  )
}

export default UndockIcon
