import { ButtonContainer, IconTitle, StyledButton } from "./styles"
import {
  reactiveTraderIcon,
  reactiveAnalyticsIcon,
  excelIcon,
  limitCheckerIcon,
} from "./icons"

interface LaunchButtonProps {
  onClick: () => void
  iconFill?: string
  iconHoverFill?: string
  iconHoverBackground?: string
  children: JSX.Element[] | JSX.Element
  title?: string
  active?: boolean
}

export const LaunchButton = (props: LaunchButtonProps) => (
  <StyledButton
    title={props.title}
    onClick={props.onClick}
    iconFill={props.iconFill}
    iconHoverFill={props.iconHoverFill}
    iconHoverBackground={props.iconHoverBackground}
    active={props.active}
  >
    {props.children}
  </StyledButton>
)

interface ApplicationProvider {
  platformName: string
  applicationType: string
  windowOptions?: any
}

interface ApplicationConfig {
  name: string
  displayName: string
  tooltipName?: string
  uuid?: string
  url?: string
  icon: JSX.Element
  iconFillColor: string
  iconHoverFillColor?: string
  iconHoverBackgroundColor?: string
  provider?: ApplicationProvider
}

const defaultWindowOptions = {
  autoShow: true,
  defaultWidth: 1280,
  defaultHeight: 900,
  minWidth: 800,
  minHeight: 600,
  resizable: true,
  maximizable: true,
  defaultCentered: true,
  frame: false,
  shadow: true,
  icon: `/static/media/adaptive.ico`,
  accelerator:
    process.env.NODE_ENV !== "development"
      ? {}
      : {
          devtools: true,
          reload: true,
          reloadIgnoringCache: true,
          zoom: true,
        },
}

const appConfigs: ApplicationConfig[] = [
  {
    name: `Reactive Trader®`,
    displayName: "RT",
    tooltipName: `Launch Reactive Trader®`,
    uuid: `reactive-trader`,
    url: "",
    icon: reactiveTraderIcon,
    iconFillColor: "#CFCFCF",
    iconHoverFillColor: "#ffffff",
    iconHoverBackgroundColor: "#28588d",
    provider: {
      platformName: "openfin",
      applicationType: "manifest",
    },
  },
  {
    name: `Reactive Analytics`,
    displayName: "RA",
    tooltipName: `Launch Reactive Analytics`,
    uuid: `reactive-analytics`,
    url: "",
    icon: reactiveAnalyticsIcon,
    iconFillColor: "#CFCFCF",
    iconHoverFillColor: "#ffffff",
    iconHoverBackgroundColor: "#AAABD1",
    provider: {
      platformName: "openfin",
      applicationType: "manifest",
    },
  },
  {
    name: "Limit Checker",
    displayName: "LC",
    tooltipName: "Launch Limit Checker",
    icon: limitCheckerIcon,
    iconFillColor: "#CFCFCF",
    iconHoverFillColor: "#ffffff",
    provider: {
      platformName: "openfin",
      applicationType: "download",
      windowOptions: {
        ...defaultWindowOptions,
        icon: `/static/media/limit-checker-icon.ico`,
      },
    },
  },
  {
    name: "Excel",
    displayName: "EX",
    tooltipName: "Launch Excel",
    icon: excelIcon,
    iconFillColor: "#CFCFCF",
    provider: {
      platformName: "openfin",
      applicationType: "excel",
    },
  },
]

export const LauncherApps: React.FC = () => {
  return (
    <>
      {appConfigs.map((app) => (
        <ButtonContainer key={app.name}>
          <LaunchButton
            title={app.tooltipName}
            onClick={() => {}}
            iconFill={app.iconFillColor}
            iconHoverFill={app.iconHoverFillColor}
            iconHoverBackground={app.iconHoverBackgroundColor}
            active={false}
          >
            {app.icon}
            <IconTitle>{app.displayName}</IconTitle>
          </LaunchButton>
        </ButtonContainer>
      ))}
    </>
  )
}
