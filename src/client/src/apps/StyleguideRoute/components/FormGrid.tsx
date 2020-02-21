import React from 'react'

import { Input } from 'rt-styleguide'
import { styled } from 'rt-theme'
import { keyframes } from 'styled-components'

const Grid = styled.div`
  display: grid;
  grid-template-columns: 100px 200px 200px;
  gap: 20px;
  align-items: center;
`

const HoveredInput = styled(Input)`
  & input {
    border-bottom: ${({ theme }) =>
      `1px solid ${theme.name === 'light' ? '#beccdc' : theme.colors.light.secondary[1]}`};
  }
`

const blink = keyframes`
  0%, 50% {
    opacity: .7;
  }
  51%, 100% {
    opacity: 0;
  }
`

const ActiveInput = styled(Input)`
  & input {
    border-bottom: ${({ theme }) => `1px solid ${theme.accents.dominant.darker}`};
  }
  & input:hover {
    border-bottom: ${({ theme }) => `1px solid ${theme.accents.dominant.base}`};
  }
  & label::before {
    content: '';
    position: absolute;
    background-color: ${({ theme }) => theme.accents.dominant.base};
    width: 1px;
    animation: ${blink} 1s infinite;
    height: 15px;
    left: 48px;
  }
`
const ActiveNumberInput = styled(ActiveInput)`
  & label::before {
    left: unset;
    right: 3px;
  }
`

const FormGrid = () => {
  return (
    <Grid>
      <div></div>
      <div>Text</div>
      <div>Figures</div>

      <div>Normal</div>
      <Input type="text" placeholder="Prompt" label="label" />
      <Input type="number" placeholder="Prompt" label="label" />

      <div>Hover</div>
      <HoveredInput type="text" placeholder="Prompt" label="label" />
      <HoveredInput type="number" placeholder="Prompt" label="label" />

      <div>Active</div>
      <ActiveInput type="text" placeholder="Prompt" label="label" />
      <ActiveNumberInput type="number" placeholder="Prompt" label="label" />

      <div>Disabled</div>
      <Input type="text" placeholder="Prompt" disabled label="label" />
      <Input type="number" placeholder="Prompt" disabled label="label" />

      <div>Populated</div>
      <Input type="text" placeholder="Prompt" value="Text" label="label" />
      <Input type="number" placeholder="Prompt" value="1000" label="label" />

      <div>Error</div>
      <Input type="text" placeholder="Prompt" status="error" value="Text" label="label" />
      <Input type="number" placeholder="Prompt" status="error" value="1000" label="label" />

      <div>Info</div>
      <Input type="text" placeholder="Prompt" status="info" value="Text" label="label" />
      <Input type="number" placeholder="Prompt" status="info" value="1000" label="label" />
    </Grid>
  )
}

export default FormGrid
