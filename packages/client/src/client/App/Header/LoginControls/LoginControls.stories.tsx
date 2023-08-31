import { Meta } from "@storybook/react"

import avatar from "@/../public/static/media/mockedAvatars/one.png"

import { UserInner } from "./LoginControls"

export default {
  title: "Header/User",
  component: UserInner,
} as Meta<typeof UserInner>

export const Default = {
  render: () => (
    <UserInner
      user={{
        code: "LMO",
        firstName: "Lorretta",
        lastName: "Moe",
        avatar,
      }}
    />
  ),

  name: "User",
}
