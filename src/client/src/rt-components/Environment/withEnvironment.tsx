import hoistNonReactStatics from 'hoist-non-react-statics'
import React from 'react'

import { Environment, EnvironmentValue } from './EnvironmentContext'

interface EnviromentProps {
  environment: EnvironmentValue
}

function getDisplayName(WrappedComponent: React.ComponentType<any>) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

export const withEnvironment = <OriginalProps extends object>(
  UnwrappedComponent: React.ComponentType<OriginalProps & EnviromentProps>
) => {
  type Props = Pick<OriginalProps, Exclude<keyof OriginalProps, keyof EnviromentProps>>

  class EnvironmentComponent extends React.Component<Props> {
    static readonly displayName = `WithEnvironment(${getDisplayName(UnwrappedComponent)})`
    static readonly WrappedComponent = UnwrappedComponent

    render() {
      return (
        <Environment.Consumer>
          {environment => <UnwrappedComponent {...this.props} environment={environment} />}
        </Environment.Consumer>
      )
    }
  }

  return hoistNonReactStatics(EnvironmentComponent, UnwrappedComponent as any)
}

export default withEnvironment
