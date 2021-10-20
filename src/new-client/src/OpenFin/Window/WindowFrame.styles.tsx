import { renderToStaticMarkup } from "react-dom/server"
import styled from "styled-components"
import { ExitIcon } from "../icons/ExitIcon"
import { PopOutIcon } from "../../components/icons/PopOutIcon"

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
  background-color: ${({ theme }) => theme.core.darkBackground};
  color: ${({ theme }) => theme.core.textColor};

  --header-height: 3.5rem;
  --footer-height: 2.5rem;
  --color-behind-views: ${({ theme }) => theme.core.darkBackground};

  #layout-container {
    height: 100%;
    width: 100%;
    padding: 0;
    background-color: ${({ theme }) => theme.core.darkBackground};
  }

  .wrapper_title {
    color: ${({ theme }) => theme.core.textColor};
  }

  .lm_tab {
    background-color: ${({ theme }) => theme.core.lightBackground};
    font-size: 3rem;
  }

  .lm_tabs {
    background-color: ${({ theme }) => theme.core.darkBackground};
    box-sizing: border-box !important;
    padding-left: 1rem;
  }

  .lm_header {
    background-color: ${({ theme }) => theme.core.darkBackground};
  }

  .lm_goldenlayout {
    background-color: ${({ theme }) => theme.core.lightBackground};
  }

  .lm_tab,
  .lm_tab.lm_active {
    background-color: ${({ theme }) => theme.core.darkBackground};
    color: ${({ theme }) => theme.core.textColor};
  }

  .lm_title {
    color: ${({ theme }) => theme.core.textColor} !important;
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
