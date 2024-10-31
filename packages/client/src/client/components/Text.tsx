import styled from "styled-components"

import { theme } from "../theme/uiskTheme"

export const Text = Object.fromEntries(
  Object.entries(theme.textStyles).map(([key, style]) => {
    return [
      key,
      styled.text`
        ${{ ...style, textTransform: "none" }}
      `,
    ]
  }),
)
