import { storiesOf } from "@storybook/react"
import React from "react"

import * as icons from "./"
import { ReactiveTraderIcon } from "./types"

const stories = storiesOf("Components/Icons", module)

type SVGElement = { type: "svg" } & JSX.Element

const isSvg = (T: SVGElement | React.FC<ReactiveTraderIcon>): T is SVGElement =>
  (T as SVGElement)?.type === "svg"

Object.entries(icons).forEach(
  ([key, Icon]: [string, SVGElement | React.FC<ReactiveTraderIcon>]) =>
    stories.add(key, () => {
      return isSvg(Icon) ? Icon : <Icon />
    }),
)
