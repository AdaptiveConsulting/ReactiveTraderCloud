import styled from "styled-components"

export const Container = styled.div`
  display: grid;
  grid-template-rows: 1fr 66px;
  align-items: stretch;
  height: 100%;
  background: ${({ theme }) => theme.core.alternateBackground};
  color: ${({ theme }) => theme.core.textColor};
`

export const Title = styled.div`
  margin-bottom: 0.5rem;
  font-size: 112.5%;
  font-weight: 600;
`

export const List = styled.div`
  padding: 1rem;
`

export const Empty = styled.div`
  font-style: italic;
`

export const Entry = styled.div`
  margin: 0 -1rem;
  padding: 0.5rem 1rem;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.core.lightBackground};
  }
`

export const Form = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  padding: 1rem;
  border-top: 1px solid ${({ theme }) => theme.core.lightBackground};
`

export const Fieldset = styled.div`
  display: flex;
  align-items: stretch;
  gap: 0.5rem;
`

export const Input = styled.input`
  display: block;
  padding: 0 0.5rem;
  background: ${({ theme }) => theme.core.lightBackground};
  border: none;
  color: ${({ theme }) => theme.core.textColor};

  &:focus {
    outline: none;
  }
`

export const Button = styled.button`
  display: block;
  padding: 0 0.5rem;
  background: ${({ theme }) => theme.accents.primary.base};
`
