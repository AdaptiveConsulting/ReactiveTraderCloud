import { Dispatch, SetStateAction, useEffect } from "react"

import { Button } from "@/client/components/Button"
import { CrossIcon } from "@/client/components/icons/CrossIcon"
import { Typography } from "@/client/components/library/Typography"
import { isiOS, isMobileDevice, isPWA } from "@/client/utils"

import { PWAInstallModal } from "./PWAInstallModal"
import { CrossButton, MainBanner } from "./PWAInstallPrompt.styles"
import { usePWABannerPrompt } from "./usePWABannerPrompt"

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

export const PWAInstallBanner = ({
  banner,
  updateBanner,
  isModalOpen,
  setIsModalOpen,
}: InstallBannerProps) => {
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

    window.addEventListener("appinstalled", handler)

    return () => window.removeEventListener("appinstalled", handler)
  }, [updateBanner])

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
      <CrossButton onClick={closeBanner}>{<CrossIcon />}</CrossButton>
      <Typography
        variant="Text md/Semibold"
        color="Colors/Text/text-primary_alt"
      >
        {isMobileDevice
          ? "Experience Reactive Trader® as an app!"
          : "Experience Reactive Trader® on your desktop!"}
      </Typography>
      <Button variant="brand" size="sm" onClick={() => installPWA(isiOS)}>
        Install
      </Button>
    </MainBanner>
  )
}
