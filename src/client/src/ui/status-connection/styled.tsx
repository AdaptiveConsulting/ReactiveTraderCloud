import _ from 'lodash'
import { styled } from 'rt-theme'
import { FunctionComponent } from 'react'
import React from 'react'
import { Popup } from 'rt-components'
import { ServiceConnectionStatus } from 'rt-types'

const buttonHeight = '2rem'

export const Button = styled.div`
  background-color: ${({ theme }) => theme.core.lightBackground};
  border-radius: 15rem;
  user-select: none;
  display: flex;
  align-items: center;
  justify-items: center;
  cursor: pointer;
  padding: 0 0.7rem;
  height: 1.6rem;
  font-size: 0.65rem;
  font-weight: 350;
`

const StatusCircleCore: FunctionComponent<{ className?: string }> = ({ className }) => {
  return (
    <div style={{ width: '0.65rem', height: '0.65rem', display: 'inline-block', marginTop: '-2px' }}>
      <svg className={className} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
        <circle cx="5" cy="5" r="5" />
      </svg>
    </div>
  )
}

export const StatusCircle = styled(StatusCircleCore)<{ status: ServiceConnectionStatus }>`
  circle {
    fill: ${({ theme, status }) =>
      status === ServiceConnectionStatus.CONNECTED
        ? theme.template.green.normal
        : status === ServiceConnectionStatus.CONNECTING
        ? theme.template.yellow.normal
        : theme.template.red.normal};
  }
`

const StatusLabelCore: FunctionComponent<{ className?: string; status: ServiceConnectionStatus }> = ({
  className,
  status,
}) => <span className={className}>{_.capitalize(status)}</span>
export const StatusLabel = styled(StatusLabelCore)`
  margin-left: 0.75rem;
`

export const Root = styled.div`
  position: relative;
  float: right;
  min-height: ${buttonHeight};
  max-height: ${buttonHeight};
  z-index: 20;

  font-size: 0.75rem;

  color: ${props => props.theme.textColor};
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

export const ServiceRoot = styled.div<{ index: number }>`
  min-height: 3rem;
  max-height: 3rem;
  padding: 0.5rem 0.5rem;

  display: flex;
  align-items: center;
  justify-content: space-between;

  color: ${props => props.theme.textColor};
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
`
