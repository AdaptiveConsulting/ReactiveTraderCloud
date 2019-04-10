import { Flex } from 'rt-components'
import { styled } from 'rt-theme'

export const Notification = styled('div')`
  height: 100%;
  width: 100%;
  background-color: ${props => props.theme.core.lightBackground};
  color: ${props => props.theme.core.textColor};
  user-select: none;
  display: flex;
  flex-direction: column;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1.25rem;
`
export const Top = styled(Flex)`
  flex-grow: 1;
`

export const Traded = styled('div')<{ isDone: boolean }>`
  text-decoration: ${({ isDone }) => (isDone ? '' : 'line-through')};
`

export const Status = styled('div')<{ isDone: boolean }>`
  color: ${({ theme, isDone }) => !isDone && theme.accents.bad.base};
`

export const Bottom = styled(Flex)``

export const MetaContainer = styled('div')`
  flex-grow: 1;
  flex-basis: 0;
`
export const MetaTitle = styled('div')`
  color: ${p => p.theme.core.textColor};
`

export const CloseContainer = styled(MetaContainer)`
  position: relative;
`
export const Close = styled('div')`
  position: absolute;
  bottom: 0;
  right: 0;
`
