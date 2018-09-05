import { styled } from 'rt-theme'

export const ConnectionOverlay = styled('div')`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.accents.bad.base};
  color: ${({ theme }) => theme.white};
`
