import { Input } from "./Input"
import styled, { keyframes } from "styled-components"

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 100px);
  grid-column-gap: 2rem;
  grid-row-gap: 0.5rem;
  align-items: center;
  margin-top: 1rem;
  margin-bottom: 3rem;

  div {
    font-size: 11px;
  }

  input {
    box-shadow: 0 0.25rem 0.375rem rgba(50, 50, 93, 0.11),
      0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.08);
  }
`

const HoveredInput = styled(Input)`
  & input {
    border-bottom: ${({ theme }) =>
      `1px solid ${
        theme.name === "light" ? "#beccdc" : theme.colors.light.secondary[4]
      }`};
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
    border-bottom: ${({ theme }) =>
      `1px solid ${theme.accents.primary.darker}`};
  }
  & input:hover {
    border-bottom: ${({ theme }) => `1px solid ${theme.accents.primary.base}`};
  }
  & label::before {
    content: "";
    position: absolute;
    background-color: ${({ theme }) => theme.accents.primary.base};
    width: 1px;
    animation: ${blink} 1s infinite;
    height: 12px;
    left: 48px;
    top: 5px;
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
      <div>Figures</div>
      <Input type="number" placeholder="Prompt" label="" />
      <HoveredInput type="number" placeholder="Value" label="" />
      <ActiveNumberInput
        type="number"
        placeholder="Prompt"
        value="10"
        label=""
      />
      <Input type="number" placeholder="Prompt" value="10" disabled label="" />

      <div>Text</div>
      <Input type="text" placeholder="Text" label="" />
      <HoveredInput type="text" placeholder="Text" status="info" label="" />
      <ActiveNumberInput
        type="text"
        placeholder="Prompt"
        status="info"
        value="Text"
        label=""
      />
      <Input type="text" placeholder="Text" label="" disabled />
    </Grid>
  )
}

export default FormGrid
