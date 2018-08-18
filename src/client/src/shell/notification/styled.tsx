import { Flex } from 'rt-components'
import { styled } from 'rt-theme'

export const Notification = styled('div')`
  height: 100%;
  background-color: ${({ theme: { background } }) => background.backgroundSecondary};
  color: ${({ theme: { text } }) => text.textPrimary};
  user-select: none;
  display: flex;
  flex-direction: column;
  padding: 0.5625rem;
`
export const Top = styled(Flex)`
  font-size: 0.75rem;
  flex-grow: 1;
`

export const Traded = styled('div')<{ isDone: boolean }>`
  text-decoration: ${({ isDone }) => (isDone ? '' : 'line-through')};
`

export const Status = styled('div')<{ isDone: boolean }>`
  color: ${({ theme: { palette }, isDone }) => !isDone && palette.accentBad.normal};
  font-size: 0.75rem;
`

export const Bottom = styled(Flex)`
  font-size: 0.75rem;
`

export const MetaContainer = styled('div')`
  flex-grow: 1;
  flex-basis: 0;
`
export const MetaTitle = styled('div')`
  color: ${({ theme: { text } }) => text.textMeta};
`

export const CloseContainer = styled(MetaContainer)`
  position: relative;
`
export const Close = styled('div')`
  position: absolute;
  bottom: 0;
  right: 0;

  i {
    cursor: pointer;
  }
`
