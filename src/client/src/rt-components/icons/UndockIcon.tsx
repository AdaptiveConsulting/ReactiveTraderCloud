import React from 'react'

interface Props {
  width: number
  height: number
}

const UndockIcon: React.FC<Props> = props => {
  const { width, height } = props

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 15 15">
      <g fill="none" fillRule="evenodd">
        <path d="M0 0H24V24H0z" transform="translate(-5 -5)" />
        <path fill="#7E8188" fillRule="nonzero" d="M5 9a2 2 0 012-2h5v6h6v4a3 3 0 01-3 3H7a2 2 0 01-2-2V9zm6 5H6v4a1 1 0 00.883.993L7 19h4v-5zm6 0h-5v5h3a2 2 0 001.995-1.85L17 17v-3zm-6-6H7a1 1 0 00-.993.883L6 9v4h5V8z" opacity=".65" transform="translate(-5 -5)" />
        <path stroke="#7E8188" d="M18 5.5h-3.5v5h5V7c0-.414-.168-.79-.44-1.06A1.495 1.495 0 0018 5.5z" transform="translate(-5 -5)" />
      </g>
    </svg>
  )
}

export default UndockIcon
