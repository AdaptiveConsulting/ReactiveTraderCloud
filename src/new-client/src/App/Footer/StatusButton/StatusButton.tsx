import { SyntheticEvent, useRef, useState, useEffect } from "react"
import { bind } from "@react-rxjs/core"
import { delay, map } from "rxjs/operators"
import styled from "styled-components/macro"
import { ServiceConnectionStatus, ServiceStatus } from "services/connection"
import {
  StatusCircle,
  StatusLabel,
  AppUrl,
  ServiceListPopup,
  ServiceList,
  Header,
} from "./styled"
import { Root, Button } from "../common-styles"
import Service from "./Service"
import { usePopUpMenu } from "utils/usePopUpMenu"
import { ServiceInstanceStatus, status$ } from "services/status"
import { of } from "rxjs"

export const Wrapper = styled.div`
  color: ${(props) => props.theme.textColor};
  opacity: 0.59;
  font-size: 0.75rem;
`
export const Link = styled.a`
  color: inherit;
  text-decoration: inherit;
`

const gitTagExists = async (gitTag: string | undefined) => {
  const response = await fetch(
    "https://api.github.com/repos/AdaptiveConsulting/ReactiveTraderCloud/releases",
  )
  const data = await response.json()
  const exists = data.find((element: any) => element.tag_name === gitTag)
  return exists
}

export const FooterVersion: React.FC = () => {
  const [versionExists, setVersionExists] = useState<boolean | void>(false)

  const URL =
    "https://github.com/AdaptiveConsulting/ReactiveTraderCloud/releases/tag/" +
    process.env.REACT_APP_VERSION

  useEffect(() => {
    gitTagExists(process.env.REACT_APP_VERSION).then((resolution) =>
      setVersionExists(resolution),
    )
  }, [])

  return (
    <Wrapper>
      {versionExists ? (
        <Link target="_blank" href={URL}>
          {process.env.REACT_APP_VERSION}
        </Link>
      ) : (
        <p>{process.env.REACT_APP_VERSION}</p>
      )}
    </Wrapper>
  )
}

const getApplicationStatus = (services: ServiceStatus[]) => {
  if (
    services.every(
      (s) => s.connectionStatus === ServiceConnectionStatus.CONNECTED,
    )
  ) {
    return ServiceConnectionStatus.CONNECTED
  }
  if (
    services.some(
      (s) => s.connectionStatus === ServiceConnectionStatus.CONNECTING,
    )
  ) {
    return ServiceConnectionStatus.CONNECTING
  }
  return ServiceConnectionStatus.DISCONNECTED
}

const selectAll = (event: SyntheticEvent) => {
  const input = event.target as HTMLInputElement
  input.select()
}

const [useServiceStatus, serviceStatus$] = bind<ServiceInstanceStatus[]>(
  status$.pipe(map(Object.values)),
  [],
)

export const [useApplicationStatus, applicationStatus$] = bind(
  of(ServiceConnectionStatus.CONNECTED).pipe(delay(1500)),
  ServiceConnectionStatus.CONNECTING,
)

export const StatusButton: React.FC = () => {
  const url = "https://web-demo.adaptivecluster.com"
  const ref = useRef<HTMLDivElement>(null)
  const { displayMenu, setDisplayMenu } = usePopUpMenu(ref)
  const services = useServiceStatus()

  const appUrl = url
  const appStatus = useApplicationStatus()
  return (
    <Root ref={ref}>
      <Button
        onClick={() => {
          setDisplayMenu((prev) => !prev)
        }}
        data-qa="status-button__toggle-button"
      >
        <StatusCircle status={appStatus} />
        <StatusLabel>
          {appStatus[0].toUpperCase() + appStatus.slice(1).toLowerCase()}
        </StatusLabel>
      </Button>

      <ServiceListPopup open={displayMenu}>
        <Header>Connections</Header>
        <ServiceList>
          <AppUrl
            title={appUrl}
            readOnly
            value={appUrl}
            onFocus={selectAll}
            onClick={selectAll}
          />

          {services.map((service) => (
            <Service key={service.serviceType} service={service} />
          ))}

          <FooterVersion />
        </ServiceList>
      </ServiceListPopup>
    </Root>
  )
}
