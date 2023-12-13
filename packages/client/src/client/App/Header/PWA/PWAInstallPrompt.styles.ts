import styled from "styled-components"

import { BAM_THEME_BLUE } from "@/client/theme/colors"

export const MainBanner = styled.div<{ isHidden: boolean }>`
  display: ${({ isHidden }) => (isHidden ? "none" : "flex")};
  align-items: center;
  padding: 0 10px;
  width: 100%;
  height: 36px;
  background-color: ${BAM_THEME_BLUE};
  color: ${({ theme }) => theme.core.darkBackground};
  z-index: 100;
`

export const CrossButton = styled.div`
  width: 24px;
  height: 24px;
  svg path:last-child {
    fill: ${({ theme }) => theme.core.darkBackground};
  }
  &:hover {
    cursor: pointer;
  }
`

export const BannerText = styled.p`
  font-size: 0.8125rem;
  font-weight: 600;
`

export const InstallButton = styled.button`
  background-color: ${BAM_THEME_BLUE};
  color: #ffffff;
  padding: 5px 9px;
  margin: 0 10px;
  border-radius: 4px;
  border: 2px solid rgba(255, 255, 255, 0.25);
  font-size: 0.6875rem;
  &:hover {
    background-color: ${({ theme }) => theme.accents.primary.darker};
  }
`
