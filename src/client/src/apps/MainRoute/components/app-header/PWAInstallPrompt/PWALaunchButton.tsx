import React, { Dispatch, SetStateAction } from 'react'
import { PWABanner, InstallButton } from './PWAInstallPrompt'
import { usePWABannerPrompt } from './usePWABannerPrompt'
interface InstallLaunchProps {
  state: string | null
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
}
export const PWALaunchButton: React.FC<InstallLaunchProps> = ({ state, setIsModalOpen }) => {
  const [prompt, promptToInstall, device] = usePWABannerPrompt()

  if (device && state === PWABanner.Hidden) {
    return <InstallButton onClick={() => setIsModalOpen(true)}>Install</InstallButton>
  } else if (prompt !== null && state === PWABanner.Hidden) {
    return <InstallButton onClick={promptToInstall}>Install PWA</InstallButton>
  }

  return null
}
