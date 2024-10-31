import { DropdownMenu } from "../DropdownMenu"
import {
  Action,
  Background,
  DropdownWrapper,
  LeftSection,
  RightSection,
  Tab,
} from "./TabBar.styled"

export interface TabBarActionConfig {
  name: string
  inner: JSX.Element
  active?: boolean
  onClick?: () => void
}

interface TabBarProps {
  items: string[]
  activeItem: string
  handleItemOnClick: (item: string) => void
  actions: TabBarActionConfig[]
}

export const TabBar = ({
  items,
  activeItem,
  handleItemOnClick,
  actions,
}: TabBarProps) => {
  return (
    <Background>
      <LeftSection>
        {items.map((item) => (
          <Tab
            active={item === activeItem}
            key={item}
            onClick={() => handleItemOnClick(item)}
            data-testid={`tabItem-${item}`}
          >
            {item}
          </Tab>
        ))}
      </LeftSection>
      <RightSection>
        {actions.toReversed().map(({ name, active, onClick, inner }) => (
          <Action key={name} active={!!active} onClick={onClick}>
            {inner}
          </Action>
        ))}
        <DropdownWrapper>
          <DropdownMenu
            selectedOption={activeItem}
            options={items}
            onSelectionChange={handleItemOnClick}
          />
        </DropdownWrapper>
      </RightSection>
    </Background>
  )
}
