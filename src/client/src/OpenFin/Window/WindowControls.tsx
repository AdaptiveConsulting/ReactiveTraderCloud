import { useEffect } from "react"

import { PopInIcon } from "@/components/icons/PopInIcon"

import { ExitIcon } from "../icons/ExitIcon"
import { MaximizeIcon } from "../icons/MaximizeIcon"
import { MinimizeIcon } from "../icons/MinimizeIcon"
import {
  closeOtherWindows,
  inMainReactiveTraderWindow,
  isWindowPlatformPrimary,
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
    const inMainWindow = inMainReactiveTraderWindow()

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
    if (inMainReactiveTraderWindow()) {
      // ONLY if main win is primary win of platform, close all platform windows
      if (isWindowPlatformPrimary()) {
        console.warn(`AJG: close platform`)
        fin.Platform.getCurrentSync().quit()
        return
      }
      // otherwise close all windows related to the main RT (FX OR Credit)
      await closeOtherWindows()
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
