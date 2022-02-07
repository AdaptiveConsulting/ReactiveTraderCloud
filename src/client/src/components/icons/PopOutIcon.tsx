interface Props {
  width?: number
  height?: number
}

export const PopOutIcon: React.FC<Props> = ({ width = 24, height = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
  >
    <g fill="none" fillRule="evenodd">
      <path d="M0 0H24V24H0z" />
      <path
        fill="#7E8188"
        d="M16.81 15.73v1.086c0 .594-.48 1.076-1.075 1.076h-1.086V16.81h1.08V15.73h1.082zm0-1.081v-1.081h-1.08v1.08h1.08zm-3.242 3.243h-1.622V16.81h1.622v1.08zm-2.703 0H9.243V16.81h1.622v1.08zm-2.703 0H7.076C6.482 17.892 6 17.41 6 16.816V15.73h1.081v1.08h1.081v1.082zM6 14.649v-1.622h1.081v1.622H6zm0-2.703v-1.622h1.081v1.622H6zm0-2.703V8.157c0-.594.48-1.076 1.076-1.076h1.086v1.081h-1.08v1.081H6zm3.243-2.162h1.081v1.081h-1.08v-1.08z"
      />
      <path
        fill="#7E8188"
        className="tear-out-hover-state"
        d="M17.351 10.324a.54.54 0 00.54-.54V6.54a.54.54 0 00-.54-.541h-3.243a.54.54 0 000 1.081h1.935l-3.398 3.402a.54.54 0 00.764.764l3.402-3.399v1.936c0 .298.242.54.54.54z"
      />
    </g>
  </svg>
)
