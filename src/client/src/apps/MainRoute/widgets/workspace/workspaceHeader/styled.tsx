import { styled } from 'rt-theme'

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 6px;
`
export const LeftNav = styled.ul`
  display: flex;
  align-self: flex-start;
  flex-wrap: wrap;
  justify-content: space-between;
`
export const LiStyle = styled.li`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  font-size: 14px;
  &:hover {
    cursor: pointer;
  }
`
export const LeftNavItemFirst = styled(LiStyle)`
  list-style-type: none;
  margin-right: 30px;
  font-size: 16px;
  &:hover {
    cursor: default;
  }
  @media (max-width: 768px) {
    margin-right: 5px;
  }
`

export const NavItem = styled(LiStyle)<{ active: boolean }>`
  list-style-type: none;
  margin-left: 15px;

  a {
    color: inherit;
    display: inline-block;
    height: 34px;
    line-height: 34px;
    opacity: ${({ active }) => (active ? '1' : '0.52')};
    text-decoration: none;
  }
`

export const RightNav = styled.ul`
  align-self: flex-end;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`

export const Rect = styled.div`
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.core.textColor};
  width: 10px;
  height: 10px;
`

export const IconWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${({ theme }) => theme.core.textColor};
`
