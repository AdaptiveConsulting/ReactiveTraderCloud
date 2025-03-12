import { PropsWithChildren } from "react"

import { Typography, TypographyProps } from "../components/Typography"

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

export const P = (props: PropsWithChildren<TypographyProps>) => (
  <Typography variant="Text lg/Regular" {...props} />
)
