import { styled } from 'rt-theme'

export const TradeButton = styled('button')`
  background-color: ${p => p.theme.palette.primary['0']};
  border-radius: 3px;
  margin: 5px 5px;
  transition: background-color 0.3s ease;
  cursor: pointer;
  border: none;
  &:hover {
    background-color: ${p => p.theme.palette.primary['3']};
  }
`
