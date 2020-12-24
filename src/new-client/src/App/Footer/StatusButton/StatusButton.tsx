import { SyntheticEvent, useRef, useState, useEffect } from "react"
import { of } from "rxjs"
import { bind } from "@react-rxjs/core"
import { map, timeoutWith } from "rxjs/operators"
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
import { status$, ServiceInstanceStatus } from "services/status"

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

const getInstanceNumber = (
  record: Record<string, ServiceInstanceStatus>,
  type: string,
) => {
  return Object.values(record).filter(
    (x) => x.isConnected && x.serviceType === type,
  ).length
}

const timeoutThreshold = 3000
const requestTimeoutLogger$ = of(
  ["blotter", "reference", "execution", "pricing", "analytics"].map(
    (serviceType) =>
      ({
        serviceType,
        connectionStatus: ServiceConnectionStatus.DISCONNECTED,
        connectedInstanceCount: 0,
      } as ServiceStatus),
  ),
)

export const [useServiceStatus, serviceStatus$] = bind(
  status$.pipe(
    map((record) => {
      const nameList: Set<string> = new Set()
      const result: ServiceStatus[] = []
      const recordValues = Object.values(record)
      recordValues.forEach((next) => {
        const newStatus = {
          serviceType: next.serviceType,
          connectedInstanceCount: getInstanceNumber(record, next.serviceType),
          connectionStatus: getInstanceNumber(record, next.serviceType)
            ? ServiceConnectionStatus.CONNECTED
            : ServiceConnectionStatus.DISCONNECTED,
        }
        if (nameList.size !== nameList.add(newStatus.serviceType).size) {
          result.push(newStatus)
        }
      })
      return result
    }),
    timeoutWith(timeoutThreshold, requestTimeoutLogger$),
  ),
  [] as ServiceStatus[],
)

export const [useApplicationStatus, applicationStatus$] = bind(
  serviceStatus$.pipe(map((status) => getApplicationStatus(status))),
  ServiceConnectionStatus.CONNECTING,
)

export const StatusButton: React.FC = () => {
  const url = "https://web-demo.adaptivecluster.com"
  const ref = useRef<HTMLDivElement>(null)
  const { displayMenu, setDisplayMenu } = usePopUpMenu(ref)
  const services: ServiceStatus[] = useServiceStatus()

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
