import React from 'react'
import { PWABanner, InstallButton } from './PWAInstallBanner'
import { usePWABannerPrompt } from './usePWABannerPrompt'
interface InstallLaunchProps {
  bannerState: string | null
}
export const InstallLaunchButton: React.FC<InstallLaunchProps> = ({ bannerState }) => {
  const [prompt, setPrompt] = usePWABannerPrompt()

  if (prompt !== null && bannerState === PWABanner.Hidden) {
    return <InstallButton onClick={setPrompt}>Install PWA</InstallButton>
  }

  return null
}
