import { Dispatch, SetStateAction, useEffect, FC } from "react"
import { CrossIcon } from "@/components/icons"
import styled from "styled-components"
import { PWAInstallModal } from "./PWAInstallModal"
import { usePWABannerPrompt } from "./usePWABannerPrompt"
import { isPWA, isiOS, isMobileDevice } from "@/utils"

const MainBanner = styled.div<{ isHidden: boolean }>`
  display: ${({ isHidden }) => (isHidden ? "none" : "flex")};
  align-items: center;
  padding: 0 10px;
  width: 100%;
  height: 32px;
  background-color: ${({ theme }) => theme.core.textColor};
  color: ${({ theme }) => theme.core.darkBackground};
  z-index: 100;
`

const CrossButton = styled.div`
  width: 24px;
  height: 24px;
  svg path:last-child {
    fill: ${({ theme }) => theme.core.darkBackground};
  }
  &:hover {
    cursor: pointer;
  }
`

const BannerText = styled.p`
  font-size: 0.8125rem;
  font-weight: 600;
`

export const InstallButton = styled.button`
  background-color: ${({ theme }) => theme.accents.primary.base};
  color: #ffffff;
  padding: 5px 9px;
  margin: 0 10px;
  border-radius: 4px;
  font-size: 0.6875rem;
  &:hover {
    background-color: ${({ theme }) => theme.accents.primary.darker};
  }
`

export enum PWABanner {
  Shown = "shown",
  Hidden = "hidden",
  NotSet = "notset",
  Installed = "installed",
}

interface InstallBannerProps {
  banner: string | null
  updateBanner: (state: PWABanner) => void
  isModalOpen: boolean
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
}

export const PWAInstallBanner: FC<InstallBannerProps> = ({
  banner,
  updateBanner,
  isModalOpen,
  setIsModalOpen,
}) => {
  const [prompt, promptToInstall] = usePWABannerPrompt()

  const isHidden = banner !== PWABanner.Shown || (!prompt && !isiOS) || isPWA()

  useEffect(() => {
    if (prompt && banner === PWABanner.NotSet) {
      updateBanner(PWABanner.Shown)
    } else if (isiOS && banner === PWABanner.NotSet) {
      updateBanner(PWABanner.Shown)
    }
  }, [prompt, banner, updateBanner])

  useEffect(() => {
    const handler = () => {
      updateBanner(PWABanner.Installed)
    }

    // TODO - This is deprecated with no mention of an alternative
    // ref - https://developer.mozilla.org/en-US/docs/Web/API/Window/appinstalled_event
    window.addEventListener("appinstalled", handler)

    return () => window.removeEventListener("appinstalled", handler)
  }, [updateBanner])

  useEffect(() => {
    // @ts-ignore
    console.log("nav", navigator.getInstalledRelatedApps)
    // @ts-ignore
    if (navigator.getInstalledRelatedApps) {
      navigator
        // @ts-ignore
        .getInstalledRelatedApps()
        .then((apps: any) => console.log("apps", apps))
        .catch((e: any) => console.log("Error getting installed apps", e))
    }
  }, [])

  const closeBanner = () => {
    updateBanner(PWABanner.Hidden)
  }

  const installPWA = (isiOS: boolean) => {
    if (isiOS) {
      setIsModalOpen(true)
    } else {
      promptToInstall()
    }
  }

  if (isModalOpen) {
    return <PWAInstallModal closeModal={() => setIsModalOpen(false)} />
  }

  return (
    <MainBanner isHidden={isHidden}>
      <CrossButton onClick={closeBanner}>{CrossIcon}</CrossButton>
      <BannerText>
        {isMobileDevice
          ? "Experience Reactive Trader® as an app!"
          : "Experience Reactive Trader® on your desktop!"}
      </BannerText>
      <InstallButton onClick={() => installPWA(isiOS)}>Install</InstallButton>
    </MainBanner>
  )
}
