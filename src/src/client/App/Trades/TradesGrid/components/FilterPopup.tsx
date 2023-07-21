import styled from "styled-components"

import { WithChildren } from "@/client/utils/utilityTypes"

export const FilterPopupOuter = styled.span`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: transparent;
  border-radius: 4px;
  color: ${({ theme }) => theme.core.textColor};
  font-size: 12px;
  padding: 8px 15px 5px 15px;
  cursor: pointer;
  display: inline-block;

  @media (max-width: 400px) {
    display: none;
  }
`

export const FilterPopupInner = styled.div<{ leftAlignFilter: boolean }>`
  position: absolute;
  width: fit-content;
  min-height: 100%;
  max-height: 8rem;
  overflow-y: auto;
  top: 2rem;
  left: ${({ leftAlignFilter }) => (leftAlignFilter ? "83%" : "10%")};
  background-color: ${({ theme }) => theme.primary.base};
  padding: 6px;
  box-shadow: ${({ theme }) => theme.core.textColor} 0px 0px 0.3125rem 0px;
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
    >
      {children}
    </FilterPopupInner>
  </FilterPopupOuter>
)
