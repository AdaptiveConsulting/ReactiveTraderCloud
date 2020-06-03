import React, { FC } from 'react'
import { GlueProvider } from '@glue42/react-hooks';

export const GlueCoreRoute: FC = ({ children }) => (
  <GlueProvider>
    {children}
  </GlueProvider>
)

export default GlueCoreRoute
