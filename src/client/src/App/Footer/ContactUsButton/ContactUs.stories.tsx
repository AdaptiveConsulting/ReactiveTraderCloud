import { Meta } from "@storybook/react"

import { ContactUs } from "./ContactUs"

export default {
  title: "Footer/ContactUs",
  component: ContactUs,
} as Meta<typeof ContactUs>

export const Default = {
  render: () => <ContactUs />,
  name: "ContactUs",
}
