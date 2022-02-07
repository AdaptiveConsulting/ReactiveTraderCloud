interface Props {
  fill?: string
  height?: number
  width?: number
}

export const ChartIcon: React.FC<Props> = ({
  fill = "#7E8188",
  height = 24,
  width = 24,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 8"
    height={height}
    width={width}
  >
    <g fill="none" fillRule="evenodd">
      <path d="M0 0H24V24H0z" transform="translate(-4 -8)" />
      <path
        fill={fill}
        d="M12.857 10.575L15.185 8l3.37 2.185 1.426 5.024c.075.266-.079.542-.344.618-.236.067-.481-.048-.586-.26l-.032-.085-1.325-4.663-2.339-1.517-2.227 2.466-2.865-1.175-1.949 3.57-1.852-3.717-2.221-1.348c-.21-.127-.293-.384-.208-.606l.04-.08c.127-.21.384-.293.605-.208l.081.04 2.47 1.498 1.125 2.26 1.46-2.672 3.043 1.245z"
        transform="translate(-4 -8)"
      />
    </g>
  </svg>
)
