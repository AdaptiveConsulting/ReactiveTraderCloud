import styled from "styled-components"

import { Stack } from "@/client/components/Stack"

export const OverlayBackgroundImage = styled(Stack)<{ url: string }>`
  flex: 1;
  background-position: center;
  background-size: contain;
  background-image: url("${({ url }) => url}");
`
