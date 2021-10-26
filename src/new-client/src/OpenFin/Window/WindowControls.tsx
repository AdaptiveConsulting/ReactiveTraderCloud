import { ExitIcon } from "../icons/ExitIcon"
import { MaximizeIcon } from "../icons/MaximizeIcon"
import { MinimizeIcon } from "../icons/MinimizeIcon"
import { PopInIcon } from "@/components/icons/PopInIcon"
import { closeOtherWindows, inMainOpenFinWindow } from "../utils/window"
import { Control, ControlsWrapper } from "./WindowHeader.styles"
import { useEffect } from "react"

export interface Props {
  close?: () => void
  minimize?: () => void
  maximize?: () => void
  popIn?: () => void
}

export const WindowControls: React.FC<Props> = ({
  close,
  minimize,
  maximize,
  popIn,
}) => {
  // Close other windows when page is refreshed to avoid recreating popups
  useEffect(() => {
    const inMainWindow = inMainOpenFinWindow()

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
    if (inMainOpenFinWindow()) {
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
