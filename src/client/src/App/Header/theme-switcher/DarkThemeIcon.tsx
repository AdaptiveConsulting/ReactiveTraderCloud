import { SVGAttributes } from "react"
import styled from "styled-components"

interface LightThemeIconProps extends SVGAttributes<Element> {
  fill?: string
  height?: number
  width?: number
}

const LightThemeIcon: React.FC<LightThemeIconProps> = ({
  fill = "#FF8D00",
  height = 24,
  width = 24,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 12 12"
    >
      <path
        fill="#D8D4EA"
        fillRule="evenodd"
        d="M3.881.015L4.267.4c-.706 1.735-.503 3.708.543 5.263C5.857 7.218 7.608 8.15 9.481 8.148c.727 0 1.446-.14 2.118-.415l.386.386c-.947 2.35-3.229 3.887-5.763 3.881C3.246 12 .686 9.893.115 6.971c-.57-2.92 1.009-5.837 3.766-6.956zm7.883 3.278l.236.235.236-.235c.13-.13.34-.13.471 0 .13.13.13.341 0 .471L12.472 4l.235.237c.13.13.13.34 0 .471-.13.13-.341.13-.471 0L12 4.471l-.236.236c-.13.13-.34.13-.471 0-.13-.13-.13-.341 0-.471l.235-.237-.235-.235c-.13-.13-.13-.34 0-.471.13-.13.341-.13.471 0zM7.146 1.439l.354.354.354-.354c.195-.195.511-.195.707 0 .195.196.195.512 0 .707l-.353.353.353.355c.195.195.195.511 0 .707-.196.195-.512.195-.707 0L7.5 3.207l-.354.354c-.195.195-.511.195-.707 0-.195-.196-.195-.512 0-.707l.354-.354-.354-.354c-.195-.195-.195-.511 0-.707.196-.195.512-.195.707 0z"
      />
    </svg>
  )
}

export default styled(LightThemeIcon)`
  [fill] {
    fill: ${(props) => props.theme.core.textColor};
  }
`
