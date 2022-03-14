import { ComponentMeta } from "@storybook/react"
import { ContactUs } from "./ContactUs"

export default {
  title: "Footer/ContactUs",
  component: ContactUs,
} as ComponentMeta<typeof ContactUs>

export const Default = () => <ContactUs />
Default.storyName = 'ContactUs'
