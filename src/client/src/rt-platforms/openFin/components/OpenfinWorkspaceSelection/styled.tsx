import { capitalize } from 'lodash'
import { styled } from 'rt-theme'
import { FunctionComponent } from 'react'
import React from 'react'
import { Popup } from 'rt-components'
import { ServiceConnectionStatus } from 'rt-types'

const buttonHeight = '2rem'

export const HrBar = styled.hr`
  height: 1px;
  color: #282d39;
  background-color: #282d39;
  margin-bottom: 10px;
  margin-top: 5px;
  border: none;
`

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
        ? theme.template.green.normal
        : status === ServiceConnectionStatus.CONNECTING
        ? theme.template.yellow.normal
        : theme.template.red.normal};
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
  position: relative;
  float: right;
  backface-visibility: hidden;
  min-height: ${buttonHeight};
  max-height: ${buttonHeight};
  z-index: 20;

  font-size: 0.75rem;

  color: ${props => props.theme.textColor};
`

export const WorkspaceListPopup = styled(Popup)`
  bottom: calc(${buttonHeight} + 0.25rem);
  right: 0;
  border-radius: 0.5rem;
`

export const WorkspaceName = styled.div`
  min-width: 5rem;
  text-transform: capitalize;
  font-size: 0.75rem;
  line-height: 1rem;
  display: inline-block;
`

export const WorkspaceRoot = styled.div`
  min-height: 3rem;
  max-height: 3rem;
  padding: 0.5rem 0.5rem;

  display: flex;
  align-items: center;
  justify-content: space-between;

  color: ${props => props.theme.textColor};
`

export const WorkspaceList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  grid-auto-flow: dense;
  padding: 0 0.75rem;

  ${WorkspaceName} {
    padding-left: 1rem;
    padding-top: 0.1rem;
  }
`

export const TextInputLabel = styled.label`
  color: ${props => props.theme.textColor};
  display: block;
`

export const TextInput = styled.input.attrs(props => ({
  type: 'text'
}))`
  background: rgba(0,0,0,0.3);
  border-radius: 3px;
  border: none;
  color: ${props => props.theme.textColor};
  display: block;
  font-size: 1.1em;
  margin: 0 0 1em;
  padding: 0.25rem 0.75rem;
  width: 100%;
`

export const FormControl = styled.div`
  padding: 0.1rem 0.5rem;
  width: 100%;
  
  > ${TextInputLabel} {
    margin-bottom: 6px;
  }
`
