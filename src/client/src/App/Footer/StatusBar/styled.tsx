import styled from "styled-components"
import Icon from "./Icon"

const headerHeight = "2rem"

export const Header = styled.div`
  display: flex;
  align-items: center;
  height: 2rem;
  padding: 0 1rem;
`

export const Root = styled.div`
  width: 100%;
  min-height: ${headerHeight};
  max-height: ${headerHeight};
  z-index: 20;

  font-size: 0.75rem;

  color: ${(props) => props.theme.textColor};

  ${Icon} {
    margin-right: 0.5rem;
  }
`

export const ChevronIcon: React.FC<{ expand: boolean }> = ({
  expand,
  ...props
}) => <Icon IconComponent={ChevronIcon} {...props} />

export const ExpandToggle = styled(ChevronIcon)`
  transform: rotate(
    ${(props: { expand: boolean }) => (props.expand ? 180 : 0)}deg
  );
  transition: transform ${({ theme }) => theme.motion.duration}ms ease;
`

export const Fill = styled.div<{ size?: number }>`
  flex: ${({ size = 1 }) => size};
`

export const ServiceList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  grid-auto-flow: dense;
  box-shadow: 0 0 1rem 0rem rgba(0, 0, 0, 0.1) inset;
`

export const ServiceName = styled.div`
  min-width: 5rem;
  text-transform: capitalize;
  font-size: 1rem;
  line-height: 1rem;
`

export const NodeCount = styled.div`
  display: block;
  margin-bottom: -0.5rem;
  min-height: 1rem;
  max-height: 1rem;
  line-height: 1rem;
  font-size: 0.5rem;
  opacity: 0.6;
`
