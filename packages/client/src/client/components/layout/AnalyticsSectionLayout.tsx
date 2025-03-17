import styled from "styled-components"

import { Stack } from "../Stack"
import { Typography } from "../Typography"
import { LayoutProps } from "./types"

const Background = styled.div`
  padding: 0 ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) =>
    theme.color["Colors/Background/bg-primary_alt"]};
`

const BodyWrapper = styled.div`
  padding-top: ${({ theme }) => theme.spacing["2xl"]};
`

export const AnalyticsSectionLayout = ({
  Header,
  Body,
  className,
}: LayoutProps) => (
  <Background className={className}>
    <Typography
      variant="Text lg/Regular"
      color="Colors/Text/text-secondary (700)"
    >
      <Stack>{Header}</Stack>
    </Typography>
    <BodyWrapper>{Body}</BodyWrapper>
  </Background>
)
