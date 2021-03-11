import styled from "styled-components"

const Icon: React.FC<{
  IconComponent: React.FC<{ expand: boolean }>
}> = ({ IconComponent, ...props }) => (
  <div {...props}>
    <IconComponent expand={false} />
  </div>
)

interface IconProps {
  size?: number
}

export default styled(Icon)<IconProps>`
  ${({ size = 1.5 }) => `
    min-width: ${size}rem;
    max-width: ${size}rem;
    min-height: ${size}rem;
    max-height: ${size}rem;
  `};

  line-height: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  background-color: ${(props) => props.theme.backgroundColor || "inherit"};
  color: ${(props) => props.theme.textColor || "inherit"};
`
