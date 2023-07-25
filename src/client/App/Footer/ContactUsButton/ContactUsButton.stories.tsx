import { Meta } from "@storybook/react"

import ContactUsButton from "./ContactUsButton"

export default {
  title: "Footer/ContactUsButton",
  component: ContactUsButton,
} as Meta<typeof ContactUsButton>

export const Default = {
  render: () => <ContactUsButton />,
  name: "ContactUsButton",
}
