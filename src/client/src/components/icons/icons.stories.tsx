import { storiesOf } from "@storybook/react"
import * as icons from "./"

const stories = storiesOf("Components/Icons", module)

Object.entries(icons).forEach(([key, Icon]: any) =>
  stories.add(key, () => {
    return Icon.type && Icon.type === "svg" ? Icon : <Icon />
  }),
)
