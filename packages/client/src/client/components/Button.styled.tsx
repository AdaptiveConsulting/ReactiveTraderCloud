import { css } from "styled-components"

const focus = css`
  outline: 2px solid
    ${({ theme }) =>
      theme.newTheme.color["Colors/Effects/Focus rings/focus-ring"]};
  outline-offset: 2px;
`

export const brand = {
  hover: css(
    ({ theme }) => `
        color: ${theme.newTheme.color["Component colors/Components/Buttons/Brand/button-brand-fg_hover"]};
        background-color: ${theme.newTheme.color["Component colors/Components/Buttons/Brand/button-brand-bg_hover"]};
    
    `,
  ),
  focus,
}
export const primary = {
  hover: css(
    ({ theme }) => `
        color: ${theme.newTheme.color["Component colors/Components/Buttons/Primary/button-primary-fg_hover"]};
        background-color: ${theme.newTheme.color["Component colors/Components/Buttons/Primary/button-primary-bg_hover"]};
    
        `,
  ),
  focus,
}
export const outline = {
  hover: css(
    () => `
        opacity: 0.65;
    
        `,
  ),
  focus,
}
export const warning = {
  hover: css(
    ({ theme }) => `
        color: ${theme.newTheme.color["Component colors/Components/Buttons/Primary/button-primary-fg_hover"]};
        background-color: ${theme.newTheme.color["Component colors/Components/Buttons/Primary/button-primary-bg"]};
        border: 1px solid ${theme.newTheme.color["Colors/Border/border-warning_subtle"]};
    
        `,
  ),
  focus,
}

export const whiteOutline = {
  hover: css(
    ({ theme }) => `
        color: ${theme.newTheme.color["Component colors/Components/Buttons/Primary/button-primary-fg_hover"]};
        background-color: ${theme.newTheme.color["Component colors/Components/Buttons/Primary/button-primary-bg"]};
        `,
  ),
  focus,
}

export default { brand, primary, outline, warning, whiteOutline }
