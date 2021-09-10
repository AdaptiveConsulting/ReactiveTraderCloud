import { FunctionComponent } from "react"
import styled from "styled-components"
import Popup from "@/components/Popup"
import { ConnectionStatus } from "@/services/connection"

const buttonHeight = "2rem"

const StatusCircleCore: FunctionComponent<{ className?: string }> = ({
  className,
}) => {
  return (
    <div
      style={{
        width: "0.65rem",
        height: "0.65rem",
        display: "inline-block",
        marginTop: "-2px",
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
        ? theme.accents.positive.base
        : status === ConnectionStatus.CONNECTING
        ? theme.accents.aware.base
        : theme.accents.negative.base};
  }
`

const StatusLabelCore: React.FC<{
  className?: string
}> = ({ className, children }) => <span className={className}>{children}</span>

export const StatusLabel = styled(StatusLabelCore)`
  margin-left: 0.75rem;
`

export const ServiceListPopup = styled(Popup)`
  bottom: calc(${buttonHeight} + 0.25rem);
  right: 0;
  border-radius: 0.5rem;
`

export const ServiceName = styled.div`
  min-width: 5rem;
  text-transform: capitalize;
  font-size: 0.75rem;
  line-height: 1rem;
  display: inline-block;
`

export const NodeCount = styled.div`
  display: block;
  margin-bottom: -0.5rem;
  min-height: 1rem;
  max-height: 1rem;
  line-height: 1rem;
  font-size: 0.8rem;
  opacity: 0.6;
`

export const ServiceRoot = styled.div`
  min-height: 3rem;
  max-height: 3rem;
  padding: 0.5rem 0.5rem;

  display: flex;
  align-items: center;
  justify-content: space-between;

  color: ${(props) => props.theme.textColor};
`

export const ServiceList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  grid-auto-flow: dense;
  padding: 0 0.75rem;

  ${ServiceName} {
    padding-left: 1rem;
    padding-top: 0.1rem;
  }

  ${NodeCount} {
    margin-bottom: 0;
  }
`

export const AppUrl = styled.input`
  border-style: none;
  color: ${(props) => props.theme.textColor};
`
export const Header = styled.div`
  font-size: 1rem;
  line-height: 2rem;
  box-shadow: 0 1px 0 ${({ theme }) => theme.core.textColor};
  margin-bottom: 1rem;
  margin-left: 5px;
  margin-right: 5px;
`
