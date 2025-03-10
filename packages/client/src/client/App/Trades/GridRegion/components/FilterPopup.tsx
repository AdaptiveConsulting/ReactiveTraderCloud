import styled from "styled-components"

import { WithChildren } from "@/client/utils/utilityTypes"

export const FilterPopupOuter = styled.span`
  position: relative;
  cursor: pointer;
  display: inline-block;

  @media (max-width: 400px) {
    display: none;
  }
`

export const FilterPopupInner = styled.div<{
  leftAlignFilter: boolean
}>`
  position: absolute;
  max-height: 150px;
  top: 20px;
  right: -20px;
  overflow-y: auto;

  float: ${({ leftAlignFilter }) => (leftAlignFilter ? "right" : undefined)};
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-primary"]};
  padding: ${({ theme }) => theme.newTheme.spacing.sm};
  box-shadow: ${({ theme }) =>
      theme.newTheme.color["Colors/Effects/Focus rings/focus-ring"]}
    0px 0px 2px 0px;
`

export const FilterPopup = ({
  parentRef,
  ariaLabel,
  children,
  leftAlignFilter = false,
}: {
  ariaLabel?: string
  leftAlignFilter?: boolean
  parentRef: React.RefObject<HTMLDivElement>
} & WithChildren) => (
  <FilterPopupOuter>
    <FilterPopupInner
      leftAlignFilter={leftAlignFilter}
      role="search"
      aria-label={ariaLabel}
      ref={parentRef}
      className="popup"
    >
      {children}
    </FilterPopupInner>
  </FilterPopupOuter>
)
