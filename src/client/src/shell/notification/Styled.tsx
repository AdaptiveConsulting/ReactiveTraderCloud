import { Flex } from 'rt-components'
import { styled } from 'rt-util'

export const Notification = styled('div')`
  height: 100%;
  background-color: ${({ theme: { palette } }) => palette.accentBad.normal};
  color: ${({ theme: { text } }) => text.textPrimary};
  user-select: none;
  display: flex;
  flex-direction: column;
  border-radius: 3px;
`
export const Top = styled(Flex)`
  flex-grow: 2;
  padding: 0.375rem;
`
export const Bottom = styled(Flex)`
  border-top: 0.0625rem solid ${({ theme: { text } }) => text.textMeta};
  padding: 0.375rem;
`
export const Status = styled('div')``
export const Traded = styled('div')``
export const MetaContainer = styled('div')`
  flex-grow: 1;
  flex-basis: 0;
`
export const MetaTitle = styled('div')`
  color: ${({ theme: { text } }) => text.textMeta};
`
export const Meta = styled('div')``
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
