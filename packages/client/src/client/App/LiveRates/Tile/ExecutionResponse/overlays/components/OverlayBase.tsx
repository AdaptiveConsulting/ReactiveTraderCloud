import { PropsWithChildren } from "react"
import styled from "styled-components"

import { Button } from "@/client/components/Button"
import { Stack, StackProps } from "@/client/components/Stack"
import { Typography } from "@/client/components/Typography"

import { OverlayProps } from "../OverlayProps"

const OverlayHeaderBackground = styled(Stack)`
  background-color: ${({ theme }) =>
    theme.color["Colors/Background/bg-tertiary"]};
`

const OverlayHeader = ({
  base,
  terms,
  tradeId,
  Icon,
}: {
  base: string
  terms: string
  Icon: React.ReactNode
  tradeId?: number
}) => (
  <OverlayHeaderBackground
    width="100%"
    paddingX="md"
    paddingY="sm"
    alignItems="center"
    gap="sm"
  >
    {Icon}
    <Typography
      variant="Text sm/Medium"
      color="Colors/Text/text-tertiary (600)"
    >{`${base}/${terms}`}</Typography>
    {tradeId && (
      <Typography
        variant="Text sm/Medium"
        color="Colors/Text/text-tertiary (600)"
        textTransform="uppercase"
        marginLeft="auto"
      >
        {"Trade id: "} <span data-testid="trade-id">{tradeId}</span>
      </Typography>
    )}
  </OverlayHeaderBackground>
)

export const OverlayBase = ({
  children,
  base,
  terms,
  tradeId,
  onClose,
  Icon,
  ...props
}: PropsWithChildren<
  OverlayProps & StackProps & { Icon: React.ReactNode }
>) => (
  <Stack
    direction="column"
    paddingBottom="sm"
    alignItems="center"
    height="100%"
    width="100%"
    {...props}
  >
    <OverlayHeader base={base} terms={terms} tradeId={tradeId} Icon={Icon} />
    {children}
    {onClose && (
      <Button variant="primary" size="sm" onClick={onClose}>
        Close
      </Button>
    )}
  </Stack>
)
