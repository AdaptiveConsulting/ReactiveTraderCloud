import styled from "styled-components"

export const Button = styled.button`
  width: 84px;
  height: 32px;
  border-radius: 3px;
  font-size: 0.75rem;
`

export const SignInButton = styled(Button)`
  background-color: ${({ theme }) => theme.accents.primary.base};
  color: white;
  &:hover {
    background-color: ${({ theme }) => theme.accents.primary.darker};
  }
`
export const LoadingButton = styled(SignInButton)`
  width: 32px;
  padding-top: 3px;
`

export const DropdownButton = styled(Button)`
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-primary"]};
  color: ${({ theme }) =>
    theme.newTheme.color["Colors/Text/text-primary (900)"]};
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  &:hover {
    background-color: ${({ theme }) => theme.accents.primary.base};
    color: white;
  }
`
export const UserWrapper = styled.div`
  position: relative;
`
export const UserContainer = styled(Button)`
  color: ${({ theme }) =>
    theme.newTheme.color[
      "Component colors/Components/Buttons/Primary/button-primary-fg"
    ]};
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border-radius: 0;
  height: 24px;
  padding-left: 5px;
`

export const UserAvatar = styled.img`
  width: 24px;
  height: 24px;
  filter: grayscale(1);
  ${DropdownButton}:hover & {
    filter: grayscale(0);
  }
`
