import React, { Dispatch, SetStateAction } from 'react'
import { PWABanner, InstallButton, MobileDevice } from './PWAInstallPrompt'
import { usePWABannerPrompt } from './usePWABannerPrompt'
interface InstallLaunchProps {
  state: string | null
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
}
export const PWALaunchButton: React.FC<InstallLaunchProps> = ({ state, setIsModalOpen }) => {
  const [prompt, promptToInstall, device] = usePWABannerPrompt()

  if (!prompt && device === MobileDevice.iOS && state === PWABanner.Hidden) {
    return <InstallButton onClick={() => setIsModalOpen(true)}>Install</InstallButton>
  } else if (prompt && state === PWABanner.Hidden) {
    return <InstallButton onClick={promptToInstall}>Install PWA</InstallButton>
  }

  return null
}
