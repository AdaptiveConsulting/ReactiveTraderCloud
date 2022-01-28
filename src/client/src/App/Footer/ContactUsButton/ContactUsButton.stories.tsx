import { ComponentMeta } from "@storybook/react"
import ContactUsButton from "./ContactUsButton"

export default {
  title: "Footer/ContactUsButton",
  component: ContactUsButton,
} as ComponentMeta<typeof ContactUsButton>

export const Default = () => <ContactUsButton />
Default.storyName = 'ContactUsButton'
