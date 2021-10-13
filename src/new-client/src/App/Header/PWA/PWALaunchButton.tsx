import { Dispatch, SetStateAction, FC } from "react"
import { PWABanner } from "./PWAInstallPrompt"
import { usePWABannerPrompt } from "./usePWABannerPrompt"
import { isiOS } from "@/utils"
import { InstallButton } from "./PWAInstallPrompt.styles"

interface InstallLaunchProps {
  state: string | null
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
}

export const PWALaunchButton: FC<InstallLaunchProps> = ({
  state,
  setIsModalOpen,
}) => {
  const [prompt, promptToInstall] = usePWABannerPrompt()

  if (!prompt && isiOS && state === PWABanner.Hidden) {
    return (
      <InstallButton onClick={() => setIsModalOpen(true)}>
        Install
      </InstallButton>
    )
  } else if (prompt && state === PWABanner.Hidden) {
    return <InstallButton onClick={promptToInstall}>Install PWA</InstallButton>
  }

  return null
}
