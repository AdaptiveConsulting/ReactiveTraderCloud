import styled from "styled-components"

import { ConnectionStatus } from "@/services/connection"

const StatusCircleCore = ({ className }: { className?: string }) => {
  return (
    <div
      style={{
        width: "0.65rem",
        height: "0.65rem",
        display: "flex",
      }}
    >
      <svg
        className={className}
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="5" cy="5" r="5" />
      </svg>
    </div>
  )
}

export const StatusCircle = styled(StatusCircleCore)<{
  status?: ConnectionStatus
}>`
  circle {
    fill: ${({ theme, status }) =>
      status === ConnectionStatus.CONNECTED
        ? theme.color["Colors/Foreground/fg-success-primary"]
        : status === ConnectionStatus.CONNECTING
          ? theme.color["Colors/Foreground/fg-warning-primary"]
          : theme.color["Colors/Foreground/fg-error-primary"]};
  }
`
