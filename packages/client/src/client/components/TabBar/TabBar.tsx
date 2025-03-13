import { DropdownMenu } from "../DropdownMenu"
import { Typography } from "../Typography"
import {
  Action,
  Background,
  DropdownWrapper,
  LeftSection,
  RightSection,
  TabStyled,
} from "./TabBar.styled"

interface TabBarActionConfigItem {
  name: string
  inner: JSX.Element
  active?: boolean
  disabled?: boolean
  size?: "sm" | "lg"
  onClick?: () => void
}

export type TabBarActionConfig = TabBarActionConfigItem[]

interface TabBarProps<T> {
  items: T[]
  activeItem: T
  handleItemOnClick?: (item: T) => void
  actions?: TabBarActionConfig
  doNotShowDropdown?: boolean
}

export const TabBar = <T extends string>({
  items,
  activeItem,
  handleItemOnClick,
  actions,
  doNotShowDropdown,
}: TabBarProps<T>) => (
  <Background>
    <LeftSection doNotShowDropdown={items.length < 2 || !!doNotShowDropdown}>
      {items.map((item) => (
        <TabStyled
          active={item === activeItem}
          key={item}
          onClick={() => handleItemOnClick?.(item)}
          data-testid={`tabItem-${item}`}
          isStatic={items.length < 2}
        >
          <Typography
            variant="Text md/Regular"
            color={
              item === activeItem
                ? "Colors/Text/text-quaternary_on-brand"
                : "Colors/Text/text-quaternary (500)"
            }
          >
            {item}
          </Typography>
        </TabStyled>
      ))}
    </LeftSection>
    <RightSection>
      {actions &&
        actions
          .toReversed()
          .map(({ name, active, onClick, inner, size, disabled }) => (
            <Action
              key={name}
              active={!!active}
              onClick={onClick}
              size={size || "sm"}
              data-testid={`action-${name}`}
              disabled={disabled}
            >
              <Typography variant="Text md/Regular">{inner}</Typography>
            </Action>
          ))}
      {handleItemOnClick && !doNotShowDropdown && (
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
