import "./tab-bar.css"

import { DropdownMenu } from "../../DropdownMenu"
import { DropdownWrapper } from "../../TabBar/TabBar.styled"
import { Typography } from "../Typography"

type ActionSize = "sm" | "lg"
type ActionSizeClass = "action-sm" | "action-lg"

interface TabBarActionConfigItem {
  name: string
  inner: JSX.Element
  active?: boolean
  disabled?: boolean
  size?: ActionSize
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
  const isStatic = items.length < 2
  const actionSizes: Record<ActionSize, ActionSizeClass> = {
    sm: "action-sm",
    lg: "action-lg",
  }
  const tabStatic = isStatic && "tab-static"
  return (
    <div className="tab-bar-container">
      <ul className={`left ${tabStatic}`}>
        {items.map((item) => (
          <li
            className={`tab ${item === activeItem && "tab-active"} ${tabStatic}`}
            key={item}
            onClick={() => handleItemOnClick?.(item)}
            data-testid={`tabItem-${item}`}
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
          </li>
        ))}
      </ul>
      <div className="right">
        {actions &&
          actions
            .toReversed()
            .map(({ name, active, onClick, inner, size, disabled }) => (
              <div
                className={`tab action ${!!active && "tab-active"} ${size ? actionSizes[size] : actionSizes["sm"]} ${disabled && "action-disabled"}`}
                key={name}
                onClick={onClick}
                data-testid={`action-${name}`}
              >
                <Typography
                  variant="Text md/Regular"
                  color="Colors/Text/text-primary (900)"
                >
                  {inner}
                </Typography>
              </div>
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
      </div>
    </div>
  )
}
