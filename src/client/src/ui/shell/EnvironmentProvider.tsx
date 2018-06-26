import hoistNonReactStatics from 'hoist-non-react-statics'
import * as React from 'react'
import { BrowserWindow, DesktopWindow } from '../tearoff'

const environmentContext = {
  isRunningDesktop: false,
  PortalManager: BrowserWindow as typeof BrowserWindow | typeof DesktopWindow
}

export type Environment = typeof environmentContext

export const { Provider: EnvironmentProvider, Consumer: EnvironmentConsumer } = React.createContext<Environment>(
  environmentContext
)

interface EnviromentProps {
  environment: Environment
}

function getDisplayName(WrappedComponent: React.ComponentType<any>) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

export const withEnvironment = <OriginalProps extends object>(
  UnwrappedComponent: React.ComponentType<OriginalProps & EnviromentProps>
) => {
  type Props = Pick<OriginalProps, Exclude<keyof OriginalProps, keyof EnviromentProps>>

  class EnvironmentComponent extends React.Component<Props> {
    static readonly displayName = `WithEnvironmentProvider(${getDisplayName(UnwrappedComponent)})`
    static readonly WrappedComponent = UnwrappedComponent

    render() {
      return (
        <EnvironmentConsumer>
          {environment => <UnwrappedComponent {...this.props} environment={environment} />}
        </EnvironmentConsumer>
      )
    }
  }

  return hoistNonReactStatics(EnvironmentComponent, UnwrappedComponent as any)
}
