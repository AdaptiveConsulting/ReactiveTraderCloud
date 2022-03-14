interface Props {
  width: number
  height: number
}

const UndockIcon: React.FC<Props> = props => {
  const { width, height } = props

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24">
      <g className="icon" fill="none" fillRule="evenodd">
        <path d="M0 0H24V24H0z" />
        <path
          fill="#535760"
          d="M5 9a2 2 0 012-2h5v6h6v4a3 3 0 01-3 3H7a2 2 0 01-2-2V9zm6 5H6v4a1 1 0 00.883.993L7 19h4v-5zm6 0h-5v5h3a2 2 0 001.995-1.85L17 17v-3zm-6-6H7a1 1 0 00-.993.883L6 9v4h5V8z"
        />
        <path
          fill="#7E8188"
          d="M18 5a2 2 0 012 2v4h-6V5h4zm-3 5h4V7a1 1 0 00-.883-.993L18 6h-3v4z"
        />
      </g>
    </svg>
  )
}

export default UndockIcon
