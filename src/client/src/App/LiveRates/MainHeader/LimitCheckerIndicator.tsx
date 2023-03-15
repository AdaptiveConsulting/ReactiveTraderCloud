import styled from "styled-components"

import { limitCheckerIcon } from "@/OpenFin/apps/Launcher/icons"

const Indicator = styled.div`
  display: flex;
  align-items: center;
  padding: 0 10px;

  > svg {
    width: 12px;
    height: 12px;
  }
`

export const LimitCheckerIndicator = () => (
  <Indicator title="Limit Checker is running">{limitCheckerIcon}</Indicator>
)
