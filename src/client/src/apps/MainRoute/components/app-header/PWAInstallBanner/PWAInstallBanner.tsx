import React, { useEffect, useState } from 'react'
import { CrossIcon } from 'rt-components'
import { styled } from 'rt-theme'
import { MobileInstallModal } from './MobileInstallModal'
import { usePWABannerPrompt } from './usePWABannerPrompt'

const MainBanner = styled.div<{ isHidden: boolean }>`
  display: ${({ isHidden }) => (isHidden ? 'none' : 'flex')};
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
  Shown = 'shown',
  Hidden = 'hidden',
  NotSet = 'notset',
  Installed = 'installed',
}

export enum Device {
  Desktop = 'desktop',
  Android = 'android',
  iOS = 'iOS',
}

interface InstallBannerProps {
  banner: string | null
  updateBanner: (state: PWABanner, device?: Device) => void
}

export const PWAInstallBanner: React.FC<InstallBannerProps> = ({ banner, updateBanner }) => {
  const [prompt, promptToInstall, device] = usePWABannerPrompt()
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const isHidden = banner !== PWABanner.Shown

  useEffect(() => {
    if (prompt && banner === PWABanner.NotSet) {
      updateBanner(PWABanner.Shown)
    } else if (device) {
      updateBanner(PWABanner.Shown, device)
    }
  }, [prompt, banner, updateBanner, device])

  useEffect(() => {
    const handler = () => {
      updateBanner(PWABanner.Installed)
    }

    window.addEventListener('appinstalled', handler)

    return () => window.removeEventListener('appinstalled', handler)
  }, [updateBanner])

  const closeBanner = () => {
    updateBanner(PWABanner.Hidden, undefined)
  }

  const installApp = (device: Device | null) => {
    if (device) {
      setModalOpen(true)
    } else {
      setModalOpen(true)
      console.log(promptToInstall())
    }
  }

  if (modalOpen) {
    return <MobileInstallModal device={device} />
  }

  return (
    <MainBanner isHidden={isHidden}>
      <CrossButton onClick={closeBanner}>{CrossIcon}</CrossButton>
      <BannerText>
        {device
          ? 'Experience Reactive Trader as an app!'
          : 'Experience Reactive Trader on your desktop!'}
      </BannerText>
      <InstallButton onClick={() => installApp(device)}>Install</InstallButton>
    </MainBanner>
  )
}
