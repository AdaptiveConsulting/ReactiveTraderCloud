import styled from "styled-components/macro"
import { AdaptiveLoader } from "./AdaptiveLoader"

interface Props {
  minWidth?: string
  minHeight?: string
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
  opacity: 0.59;
  fill: ${({ theme }) => theme.core.textColor};
`

export const Loader: React.FC<Props> = (props) => (
  <LoadableStyle {...props}>
    <AdaptiveLoader size={50} speed={1.4} />
  </LoadableStyle>
)
