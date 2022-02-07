import { Application } from "openfin/_v2/main"
import { useState } from "react"
import { appConfigs, ApplicationConfig } from "./applicationConfigurations"
import { LaunchButton } from "./components/LaunchButton"
import { ButtonContainer, IconTitle } from "./styles"
import { open } from "./tools"

export const LauncherApps: React.FC = () => {
  const [openedApps, setOpenedApps] = useState<string[]>([])

  const addToOpenedList = (name: string) => {
    setOpenedApps([...openedApps, name])
  }

  const removeFromOpenedList = (name: string) => {
    const newState = [...openedApps].filter((item) => item !== name)
    setOpenedApps(newState)
  }

  const handleOpen = async (app: ApplicationConfig) => {
    try {
      const opened = await open(app)

      if (!opened) return

      const currentApp = opened as Application
      currentApp.addListener("closed", () => removeFromOpenedList(app.name))
      addToOpenedList(app.name)
    } catch (err) {
      // TODO: Is this message accurate? Couldn't there be other causes for errors?
      console.warn("Error on app open: already opened?")
      addToOpenedList(app.name)
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
            active={openedApps.includes(app.name)}
          >
            {app.icon}
            <IconTitle>{app.displayName}</IconTitle>
          </LaunchButton>
        </ButtonContainer>
      ))}
    </>
  )
}
