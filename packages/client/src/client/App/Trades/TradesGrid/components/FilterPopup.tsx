import { WithChildren } from "client/utils/utilityTypes"
import styled from "styled-components"

export const FilterPopupOuter = styled.span`
  position: absolute;
  width: inherit;
  height: 100%;
  background-color: transparent;
  border-radius: 4px;
  color: ${({ theme }) => theme.core.textColor};
  font-size: 12px;
  cursor: pointer;
  display: inline-block;

  @media (max-width: 400px) {
    display: none;
  }
`

export const FilterPopupInner = styled.div<{
  leftAlignFilter: boolean
}>`
  width: fit-content;
  min-height: 100%;
  max-height: 8rem;
  overflow-y: auto;
  margin-top: 2rem;
  float: ${({ leftAlignFilter }) => (leftAlignFilter ? "right" : undefined)};
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
      className="popup"
    >
      {children}
    </FilterPopupInner>
  </FilterPopupOuter>
)
