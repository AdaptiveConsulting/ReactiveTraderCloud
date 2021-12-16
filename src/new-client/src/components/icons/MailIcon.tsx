import styled from "styled-components"
import { dark } from "@/theme"
import { SVGAttributes } from "react"

interface Props extends SVGAttributes<Element> {
  fill?: string
  size?: number
  active?: boolean
}

const MailIcon: React.FC<Props> = ({
  fill = "#000",
  size = 2,
  style,
  active,
  ...props
}) => {
  return (
    <svg
      height={size + "rem"}
      width={size + "rem"}
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      x="0px"
      y="0px"
      viewBox="0 0 100 100"
      {...props}
    >
      <g fill={fill}>
        <path d="M84,32.1c0-3.3-2.7-6.1-6.1-6.1H22.1c-3.3,0-6.1,2.7-6.1,6.1v34.9c0,3.3,2.7,6.1,6.1,6.1h55.9c3.3,0,6.1-2.7,6.1-6.1V32.1z    M22.1,30h55.9c0.3,0,0.5,0.1,0.8,0.1L51.2,50.7c-0.7,0.5-1.7,0.5-2.5,0L21.3,30.1C21.5,30.1,21.8,30,22.1,30z M80,66.9   c0,1.1-0.9,2.1-2.1,2.1H22.1c-1.1,0-2.1-0.9-2.1-2.1V34.2l26.4,19.7c1.1,0.8,2.3,1.2,3.6,1.2s2.6-0.4,3.6-1.2L80,34.2V66.9z"></path>
      </g>
    </svg>
  )
}

export default styled(MailIcon)`
  [fill] {
    fill: ${(props) =>
      props.active ? props.theme.accents.primary.base : dark.primary[5]};
  }
  margin-right: 0.3rem;
`
