import styled from "styled-components"

import { Stack } from "../../Stack"
import { LayoutProps } from "../types"

const Background = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`

const BodyWrapper = styled(Stack)`
  flex: 1;
  overflow-y: auto;
  background-color: ${({ theme }) =>
    theme.color["Colors/Background/bg-primary_alt"]};
`

export const RegionLayout = ({
  Header,
  Body,
  className,
  ...props
}: LayoutProps) => {
  return (
    <Background className={className} role="region">
      {Header}
      <BodyWrapper direction="column" {...props}>
        {Body}
      </BodyWrapper>
    </Background>
  )
}
