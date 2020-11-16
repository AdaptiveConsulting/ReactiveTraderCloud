import { capitalize } from 'lodash'
import styled from 'styled-components/macro'
import { FunctionComponent } from 'react'
import React from 'react'
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
    <div
      style={{ width: '0.65rem', height: '0.65rem', display: 'inline-block', marginTop: '-2px' }}
    >
      <svg className={className} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
        <circle cx="5" cy="5" r="5" />
      </svg>
    </div>
  )
}

export const StatusCircle = styled(StatusCircleCore)<{ status?: ServiceConnectionStatus }>`
  circle {
    fill: ${({ theme, status }) =>
      status === ServiceConnectionStatus.CONNECTED
        ? theme.accents.positive.base
        : status === ServiceConnectionStatus.CONNECTING
        ? theme.accents.aware.base
        : theme.accents.negative.base};
  }
`

const StatusLabelCore: FunctionComponent<{
  className?: string
  status?: ServiceConnectionStatus
}> = ({ className, status }) => <span className={className}>{capitalize(status)}</span>
export const StatusLabel = styled(StatusLabelCore)`
  margin-left: 0.75rem;
`

export const Root = styled.div`
  backface-visibility: hidden;
  min-height: ${buttonHeight};
  max-height: ${buttonHeight};

  font-size: 0.75rem;

  color: ${props => props.theme.textColor};
`

export const ServiceName = styled.div`
  min-width: 5rem;
  text-transform: capitalize;
  font-size: 1rem;
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

export const Background = styled.div`
  background-color: ${({ theme }) => theme.core.alternateBackground};
  color: ${({ theme }) => theme.core.textColor};
  height: 100%;
  width: 100%;
  padding: 1rem;
  margin: 0;
  position: absolute;
  overflow: hidden;
`
export const Header = styled.div`
  font-size: 1.25rem;
  line-height: 3rem;
  box-shadow: 0 1px 0 ${({ theme }) => theme.core.textColor};
  margin-bottom: 1rem;
`