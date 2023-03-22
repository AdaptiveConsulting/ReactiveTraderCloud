import { Dispatch, SetStateAction } from "react"

import { isiOS } from "@/utils"

import { PWABanner } from "./PWAInstallPrompt"
import { InstallButton } from "./PWAInstallPrompt.styles"
import { usePWABannerPrompt } from "./usePWABannerPrompt"

export const LaunchButtonInner = ({
  onClick,
  hasPrompt,
}: {
  onClick: () => void
  hasPrompt: boolean
}) => (
  <InstallButton onClick={onClick}>
    Install{hasPrompt ? " PWA" : ""}
  </InstallButton>
)

interface InstallLaunchProps {
  state: string | null
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
}

export const PWALaunchButton = ({
  state,
  setIsModalOpen,
}: InstallLaunchProps) => {
  const [prompt, promptToInstall] = usePWABannerPrompt()

  if (!prompt && isiOS && state === PWABanner.Hidden) {
    return (
      <LaunchButtonInner
        onClick={() => setIsModalOpen(true)}
        hasPrompt={false}
      />
    )
  } else if (prompt && state === PWABanner.Hidden) {
    return <LaunchButtonInner onClick={promptToInstall} hasPrompt />
  }

  return null
}
