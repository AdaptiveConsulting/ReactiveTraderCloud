import { Application } from "openfin-adapter"
import { useState } from "react"
import { appConfigs, ApplicationConfig } from "./applicationConfigurations"
import { LaunchButton } from "./components/LaunchButton"
import { ButtonContainer, IconTitle } from "./styles"
import { open } from "./tools"

export const LauncherApps = () => {
  const [openedApps, setOpenedApps] = useState<Set<string>>(new Set())

  const addToOpenedList = (name: string) => {
    const newState = new Set(openedApps)
    newState.add(name)
    setOpenedApps(newState)
  }

  const removeFromOpenedList = (name: string) => {
    const newState = new Set(openedApps)
    newState.delete(name)
    setOpenedApps(newState)
  }

  const handleOpen = async (app: ApplicationConfig) => {
    try {
      const opened = await open(app)
      if (!opened) return

      const currentApp = opened as Application
      currentApp.addListener("closed", () => {
        removeFromOpenedList(app.name)
      })
      addToOpenedList(app.name)
    } catch (err) {
      console.warn(err, "Error on app open")
    }
  }

  return (
    <>
      {appConfigs.map((app) => (
        <ButtonContainer key={app.name}>
          <LaunchButton
            title={app.tooltipName}
            onClick={() => handleOpen(app)}
            iconFill={app.iconFillColor}
            iconHoverFill={app.iconHoverFillColor}
            iconHoverBackground={app.iconHoverBackgroundColor}
            active={openedApps.has(app.name)}
          >
            {app.icon}
            <IconTitle>{app.displayName}</IconTitle>
          </LaunchButton>
        </ButtonContainer>
      ))}
    </>
  )
}
