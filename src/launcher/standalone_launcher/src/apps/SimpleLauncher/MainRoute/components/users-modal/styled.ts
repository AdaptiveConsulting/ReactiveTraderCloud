import styled from 'styled-components/macro'

export const Header = styled.div`
  align-self: flex-start;
  font-size: 1.1875rem;
  padding: 3px 8px;
`

export const SubHeader = styled(Header)`
  font-size: 0.8125rem;
  padding-bottom: 18px;
`

export const UserList = styled.ul`
  width: 360px;
  list-style: none;
`

export const User = styled.li`
  height: 50px;
  display: grid;
  grid-template-columns: 44px 1fr 75px;
  align-items: center;
  border-bottom: ${({ theme }) => `1px solid ${theme.primary[2]}`};
  border-radius: 3px;
  &:hover {
    background-color: ${({ theme }) => theme.primary[3]};
  }
  &:first-child {
    border-top: ${({ theme }) => `1px solid ${theme.primary[2]}`};
  }
`

export const Button = styled.button`
  width: 65px;
  height: 26px;
  border-radius: 3px;
  background-color: ${({ theme }) => theme.primary[3]};
  &:hover {
    background-color: ${({ theme }) => theme.accents.primary.darker};
    color: ${({ theme }) => theme.white};
  }
`

export const SignInButton = styled(Button)`
  visibility: hidden;
  color: ${({ theme }) => theme.white};
  background-color: ${({ theme }) => theme.accents.primary.base};
  ${User}:hover & {
    visibility: visible;
  }
`

export const CancelButton = styled(Button)`
  align-self: flex-end;
  margin-top: 22px;
  margin-right: 6px;
`

export const Avatar = styled.img`
  width: 32px;
  height: 32px;
  filter: grayscale(1);
  justify-self: center;
  ${User}:hover & {
    filter: grayscale(0);
  }
`

export const UserName = styled.div`
  font-size: 0.8125rem;
`

export const UserRole = styled.div`
  font-style: italic;
  font-weight: 300;
`
