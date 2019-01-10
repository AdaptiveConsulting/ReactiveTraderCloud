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
`

export const NavItem = styled(LiStyle)<{ active: boolean }>`
  height: 34px;
  list-style-type: none;
  margin-left: 10px;
  background-color: ${({ active }) => (active ? '#2f3542' : 'transparent')};
  opacity: ${({ active }) => (active ? '1' : '0.52')};
`
export const RightNav = styled.ul`
  align-self: flex-end;
  display: flex;
  flex-wrap: wrap;
`

export const Rect = styled.div`
  background-color: transparent;
  border: 1px solid white;
  width: 10px;
  height: 10px;
`

export const IconWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`
