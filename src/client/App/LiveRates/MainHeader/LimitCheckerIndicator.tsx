import { limitCheckerIcon } from "client/OpenFin/apps/Launcher/icons"
import styled from "styled-components"

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
