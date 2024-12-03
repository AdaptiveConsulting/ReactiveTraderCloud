import { Dispatch, SetStateAction } from "react"

import { Button } from "@/client/components/Button"
import { isiOS } from "@/client/utils"

import { PWABanner } from "./PWAInstallPrompt"
import { usePWABannerPrompt } from "./usePWABannerPrompt"

export const LaunchButtonInner = ({
  onClick,
  hasPrompt,
}: {
  onClick: () => void
  hasPrompt: boolean
}) => (
  <Button variant="outline" size="lg" onClick={onClick}>
    Install{hasPrompt ? " PWA" : ""}
  </Button>
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
