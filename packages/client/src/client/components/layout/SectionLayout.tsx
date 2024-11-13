import styled from "styled-components"

import { FlexBox } from "../FlexBox"
import { Typography } from "../Typography"
import { LayoutProps } from "./types"

const Background = styled.div`
  padding: 0 ${({ theme }) => theme.newTheme.spacing.xl};
  padding-top: ${({ theme }) => theme.newTheme.spacing.xl};
`

const BodyWrapper = styled.div`
  padding-top: ${({ theme }) => theme.newTheme.spacing["2xl"]};
`

export const SectionLayout = ({ Header, Body, style }: LayoutProps) => (
  <Background style={style}>
    <Typography
      variant="Text lg/Regular"
      color="Colors/Text/text-secondary (700)"
    >
      <FlexBox>{Header}</FlexBox>
    </Typography>
    <BodyWrapper>{Body}</BodyWrapper>
  </Background>
)
