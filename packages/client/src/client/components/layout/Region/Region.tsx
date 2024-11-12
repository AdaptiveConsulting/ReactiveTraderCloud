import { Subscribe } from "@react-rxjs/core"
import React from "react"

import { LayoutProps } from "../types"
import { RegionLayout } from "./"

export const Region = ({
  source$,
  fallback,
  children,
  Header,
  Body,
  style,
}: LayoutProps & React.ComponentProps<typeof Subscribe>) => {
  return (
    <Subscribe source$={source$} fallback={fallback}>
      {children}
      <RegionLayout Header={Header} Body={Body} style={style} />
    </Subscribe>
  )
}
