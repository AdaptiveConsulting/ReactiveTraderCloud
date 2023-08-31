import { useEffect } from "react"

import { PopInIcon } from "@/client/components/icons/PopInIcon"

import { ExitIcon } from "../icons/ExitIcon"
import { MaximizeIcon } from "../icons/MaximizeIcon"
import { MinimizeIcon } from "../icons/MinimizeIcon"
import {
  closeOtherWindows,
  inReactiveTraderMainWindow,
  quitPlatform,
} from "../utils/window"
import { Control, ControlsWrapper } from "./WindowHeader.styles"

export interface Props {
  close?: () => void
  minimize?: () => void
  maximize?: () => void
  popIn?: () => void
}

export const WindowControls = ({ close, minimize, maximize, popIn }: Props) => {
  // Close other windows when page is refreshed to avoid recreating popups
  useEffect(() => {
    const inMainWindow = inReactiveTraderMainWindow()

    const cb = async () => {
      await closeOtherWindows()
    }

    if (inMainWindow) {
      window.addEventListener("beforeunload", cb)
    }

    return () => {
      if (inMainWindow) {
        window.removeEventListener("beforeunload", cb)
      }
    }
  }, [])

  async function wrappedClose() {
    if (inReactiveTraderMainWindow()) {
      // ONLY if RT/Credit/LC main win is primary win of platform, close all platform windows
      // TODO Commenting for now until we find why this sometimes closes every window
      // https://openfin.zendesk.com/hc/en-us/requests/19445
      // fin.Platform.getCurrentSync().quit()
      await quitPlatform()
    }

    if (close) {
      close()
    }
  }

  return (
    <ControlsWrapper>
      {minimize && (
        <Control
          accent="aware"
          onClick={minimize}
          data-qa="openfin-chrome__minimize"
        >
          <MinimizeIcon />
        </Control>
      )}

      {maximize && (
        <Control
          accent="primary"
          onClick={maximize}
          data-qa="openfin-chrome__maximize"
        >
          <MaximizeIcon />
        </Control>
      )}

      {popIn && (
        <Control
          accent="primary"
          onClick={popIn}
          data-qa="openfin-chrome__popin"
        >
          <PopInIcon />
        </Control>
      )}

      {close && (
        <Control
          accent="aware"
          onClick={wrappedClose}
          data-qa="openfin-chrome__close"
        >
          <ExitIcon />
        </Control>
      )}
    </ControlsWrapper>
  )
}
