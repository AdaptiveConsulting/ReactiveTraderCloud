import { Subscribe } from "@react-rxjs/core"
import React from "react"

import { RegionLayout, RegionLayoutProps } from "./RegionLayout"

export const Region = ({
  source$,
  fallback,
  children,
  Header,
  Body,
}: RegionLayoutProps & React.ComponentProps<typeof Subscribe>) => {
  return (
    <Subscribe source$={source$} fallback={fallback}>
      {children}
      <RegionLayout Header={Header} Body={Body} />
    </Subscribe>
  )
}
