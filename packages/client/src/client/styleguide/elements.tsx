import { PropsWithChildren } from "react"
import styled from "styled-components"

import { Typography, TypographyProps } from "../components/Typography"

export { Paragraph } from "./styled"

export const H2 = (props: PropsWithChildren<TypographyProps>) => (
  <Typography
    variant="Display md/Regular"
    color="Colors/Text/text-brand-primary (900)"
    textTransform="uppercase"
    paddingTop="5xl"
    allowLineHeight
    {...props}
  />
)

export const H3 = (props: PropsWithChildren<TypographyProps>) => (
  <Typography
    variant="Display sm/Regular"
    allowLineHeight
    marginBottom="sm"
    {...props}
  />
)

export const H5 = (props: PropsWithChildren<TypographyProps>) => (
  <Typography variant="Text xl/Regular" {...props} />
)

export const P = (props: PropsWithChildren<TypographyProps>) => (
  <Typography variant="Text lg/Regular" {...props} />
)

export const SectionNumber = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  min-height: 3.5rem;
  max-height: 3.5rem;
  min-width: 3.5rem;
  max-width: 3.5rem;

  font-size: 1.5rem;

  color: ${({ theme }) => theme.secondary[2]};
  box-shadow: 0 0 0 0.125rem ${({ theme }) => theme.secondary[2]};
`
