import React from 'react'
import styled from 'styled-components'
import { usePlatform } from 'rt-platforms'

const PWAInstallBanner = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  padding: 0 10px;
  top: 60px;
  left: 0;
  width: 100%;
  height: 45px;
  background-color: #ffffff;
  color: #000000;
  z-index: 100;
`

const Install = styled.button`
  background-color: blue;
  color: white;
  padding: 8px 10px;
  margin: 0 10px;
  border-radius: 4px;
  opacity: 0.5;
  &:hover {
    opacity: 1;
  }
`

export const InstallBanner: React.FC = () => {
  const platform = usePlatform()

  // N.B. In the current version of chrome you have to enable: #bypass-app-banner-engagement-checks

  let deferredPrompt: any
  if (platform.type === 'browser') {
    window.addEventListener('beforeinstallprompt', (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later.
      deferredPrompt = e
      // Update UI notify the user they can install the PWA
      console.log('ALEX_before install')
    })
  }

  const installPWA = () => {
    console.log('Install button clicked')
    deferredPrompt.prompt()
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt')
      } else {
        console.log('User dismissed the install prompt')
      }
    })
  }

  return (
    <PWAInstallBanner>
      Experience desktop behaviours from our web app
      <Install onClick={installPWA}>Install</Install>
    </PWAInstallBanner>
  )
}
