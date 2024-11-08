import { DropdownMenu } from "../DropdownMenu"
import {
  Action,
  Background,
  DropdownWrapper,
  LeftSection,
  RightSection,
  Tab,
} from "./TabBar.styled"

interface TabBarActionConfigItem {
  name: string
  inner: JSX.Element
  active?: boolean
  size?: "sm" | "lg"
  onClick?: () => void
}

export type TabBarActionConfig = TabBarActionConfigItem[]

interface TabBarProps<T> {
  items: T[]
  activeItem: T
  handleItemOnClick?: (item: T) => void
  actions?: TabBarActionConfig
}

export const TabBar = <T extends string>({
  items,
  activeItem,
  handleItemOnClick,
  actions,
}: TabBarProps<T>) => {
  return (
    <Background>
      <LeftSection>
        {items.map((item) => (
          <Tab
            active={item === activeItem}
            key={item}
            onClick={() => handleItemOnClick?.(item)}
            data-testid={`tabItem-${item}`}
            isStatic={items.length < 2}
          >
            {item}
          </Tab>
        ))}
      </LeftSection>
      <RightSection>
        {actions &&
          actions.toReversed().map(({ name, active, onClick, inner, size }) => (
            <Action
              key={name}
              active={!!active}
              onClick={onClick}
              size={size || "sm"}
              data-testid={`action-${name}`}
            >
              {inner}
            </Action>
          ))}
        {handleItemOnClick && (
          <DropdownWrapper>
            <DropdownMenu
              selectedOption={activeItem}
              options={items}
              onSelectionChange={handleItemOnClick}
            />
          </DropdownWrapper>
        )}
      </RightSection>
    </Background>
  )
}
