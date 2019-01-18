import hoistNonReactStatics from 'hoist-non-react-statics'
import React from 'react'

import { PlatformAdapter } from './adapters'
import { PlatformConsumer } from './context'

interface PlatformProps {
  platform: PlatformAdapter
}

function getDisplayName(WrappedComponent: React.ComponentType<any>) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

export const withPlatform = <OriginalProps extends object>(
  UnwrappedComponent: React.ComponentType<OriginalProps & PlatformProps>,
) => {
  type Props = Pick<OriginalProps, Exclude<keyof OriginalProps, keyof PlatformProps>>

  class PlatformComponent extends React.Component<Props> {
    static readonly displayName = `WithPlatform(${getDisplayName(UnwrappedComponent)})`
    static readonly WrappedComponent = UnwrappedComponent

    render() {
      return (
        <PlatformConsumer>
          {platform => <UnwrappedComponent {...this.props as OriginalProps} platform={platform} />}
        </PlatformConsumer>
      )
    }
  }

  return hoistNonReactStatics(PlatformComponent, UnwrappedComponent as any)
}

export default withPlatform
