import { ComponentMeta } from "@storybook/react"
import { UserInner } from "./LoginControls"
import avatar from "../../../../public/static/media/mockedAvatars/one.png"

export default {
  title: "Header/User",
  component: UserInner,
} as ComponentMeta<typeof UserInner>

export const Default = () => (
  <UserInner
    user={{
      code: "LMO",
      firstName: "Lorretta",
      lastName: "Moe",
      avatar,
    }}
  />
)

Default.storyName = "User"
