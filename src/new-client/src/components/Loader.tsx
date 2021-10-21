import styled from "styled-components"
import { AdaptiveLoader } from "./AdaptiveLoader"

interface Props {
  minWidth?: string
  minHeight?: string
  ariaLabel?: string
  size?: number
  opacity?: number
}

const LoadableStyle = styled.div<Props>`
  width: 100%;
  min-width: ${({ minWidth = "100%" }) => minWidth};
  height: 100%;
  min-height: ${({ minHeight = "100%" }) => minHeight};
  border-radius: 0.1875rem;
  background-color: ${({ theme }) => theme.core.lightBackground};
  color: ${({ theme }) => theme.core.textColor};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  opacity: ${({ opacity }) => opacity ?? "0.59"};
  fill: ${({ theme }) => theme.core.textColor};
`

export const Loader: React.FC<Props> = ({ size, ...props }) => (
  <LoadableStyle {...props}>
    <AdaptiveLoader size={size || 50} speed={1.4} ariaLabel={props.ariaLabel} />
  </LoadableStyle>
)
