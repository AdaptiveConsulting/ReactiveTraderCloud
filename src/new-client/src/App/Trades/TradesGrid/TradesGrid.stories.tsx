import React from "react"
import { storiesOf } from "@storybook/react"
import { TradesGrid } from "./TradesGrid"
import Story from "@/stories/Story"
import { Subscribe } from "@react-rxjs/core"
import { tableTrades$ } from "@/App/Trades/TradesState"

const stories = storiesOf("Blotter", module)

stories.add("Blotter", () => (
  <Subscribe source$={tableTrades$}>
    <Story>
      <div style={{ height: "460px", width: "100%" }}>
        <TradesGrid />
      </div>
    </Story>
  </Subscribe>
))
