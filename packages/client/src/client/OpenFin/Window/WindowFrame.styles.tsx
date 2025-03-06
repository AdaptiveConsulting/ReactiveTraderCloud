import { renderToStaticMarkup } from "react-dom/server"
import styled from "styled-components"

import { PopOutIcon } from "../../components/icons/PopOutIcon"
import { ExitIcon } from "../icons/ExitIcon"

const exitIconString = encodeURIComponent(renderToStaticMarkup(<ExitIcon />))
const popoutIconString = encodeURIComponent(
  renderToStaticMarkup(<PopOutIcon />),
)

export const FrameRoot = styled.div`
  position: absolute;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-primary"]};
  color: ${({ theme }) =>
    theme.newTheme.color["Colors/Text/text-primary (900)"]};

  --header-height: 3.5rem;
  --footer-height: 2.5rem;
  --color-behind-views: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-primary"]};

  #layout-container {
    height: 100%;
    width: 100%;
    padding: 0;
    background-color: ${({ theme }) =>
      theme.newTheme.color["Colors/Background/bg-primary"]};
  }

  .wrapper_title {
    color: ${({ theme }) =>
      theme.newTheme.color["Colors/Text/text-primary (900)"]};
  }

  .lm_tab {
    background-color: ${({ theme }) =>
      theme.newTheme.color["Colors/Background/bg-secondary_subtle"]};
  }

  .lm_tabs {
    background-color: ${({ theme }) =>
      theme.newTheme.color["Colors/Background/bg-primary"]};
    box-sizing: border-box !important;
    padding-left: 1rem;
  }

  .lm_header {
    background-color: ${({ theme }) =>
      theme.newTheme.color["Colors/Background/bg-primary"]};
  }

  .lm_goldenlayout {
    background-color: ${({ theme }) =>
      theme.newTheme.color["Colors/Background/bg-secondary_subtle"]};
  }

  .lm_tab,
  .lm_tab.lm_active {
    background-color: ${({ theme }) =>
      theme.newTheme.color["Colors/Background/bg-primary"]};
    color: ${({ theme }) =>
      theme.newTheme.color["Colors/Text/text-primary (900)"]};
  }

  .lm_header .lm_tab .lm_title {
    color: ${({ theme }) =>
      theme.newTheme.color["Colors/Text/text-primary (900)"]};
  }

  .lm_close_tab {
    background-image: url("data:image/svg+xml;utf8,${exitIconString}") !important;
    background-size: 20px !important;
  }

  .lm_popout {
    background-image: url("data:image/svg+xml;utf8,${popoutIconString}") !important;
    background-size: 30px !important;
    margin: 0.5rem 1.5rem 0 0;
  }
`
