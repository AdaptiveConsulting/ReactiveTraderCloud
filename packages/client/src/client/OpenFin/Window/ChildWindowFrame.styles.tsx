import { renderToStaticMarkup } from "react-dom/server"
import styled from "styled-components"

import { PopOutIcon } from "../../components/icons/PopOutIcon"
import { ExitIcon } from "../icons/ExitIcon"

const exitIconString = encodeURIComponent(renderToStaticMarkup(<ExitIcon />))
const popoutIconString = encodeURIComponent(
  renderToStaticMarkup(<PopOutIcon />),
)

export const FrameRoot = styled.div`
  background-color: ${({ theme }) =>
    theme.color["Colors/Background/bg-primary"]};
  color: ${({ theme }) => theme.color["Colors/Text/text-primary (900)"]}};
  height: 100%;
  width: 100%;
  padding: 0px;
  margin: 0;
  position: absolute;
  overflow: hidden;

  --header-height: 1.5rem;
  --footer-height: 0rem;

  #layout-container {
    height: 100%;
    width: 100%;
    padding: 0;
  }

  .lm_tab {
    margin-left: 1rem;
    background-color: ${({ theme }) => theme.color["Colors/Background/bg-secondary"]}};
  }

  .lm_tabs {
    background-color: ${({ theme }) =>
      theme.color["Colors/Background/bg-primary"]};
    border-radius: 0px;
  }

  .lm_content {
    background-color: ${({ theme }) => theme.color["Colors/Background/bg-secondary"]}};
  }

  .lm_header .lm_tab.lm_active  {
    background-color: ${({ theme }) =>
      theme.color["Colors/Background/bg-primary"]};
    color: ${({ theme }) => theme.color["Colors/Text/text-primary (900)"]}} ;
  }

  .lm_splitter {
    background-color: ${({ theme }) => theme.color["Colors/Text/text-primary (900)"]}};
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

  .lm_header .lm_tab .lm_title {
    color: ${({ theme }) => theme.color["Colors/Text/text-primary (900)"]};
  }
`
