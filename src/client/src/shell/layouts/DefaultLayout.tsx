import React from 'react'

import AppLayout, { Props as AppLayoutProps } from './AppLayout'
import BodyLayout, { Props as BodyLayoutProps } from './BodyLayout'

const DefaultLayout: React.SFC<AppLayoutProps & BodyLayoutProps> = ({ body, aside, ...props }) => (
  <AppLayout body={<BodyLayout body={body} aside={aside} />} {...props} />
)

export default DefaultLayout
