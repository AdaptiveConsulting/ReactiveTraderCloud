import ContactUsButton from "./ContactUsButton"
import StatusBar from "./StatusBar"
import { StatusButton } from "./StatusButton"
import { Version } from "./Version"
import { storiesOf } from "@storybook/react"
import Story from "@/stories/Story"
import { Flex } from "@/Web/Web.styles"
import { Wrapper } from "@/App/Footer/Version/styled"
import styled from "styled-components"

const FooterWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: end;
`

const storiesFooter = storiesOf("Footer", module)

storiesFooter.add("Footer", () => (
  <Story>
    <FooterWrapper>
      <StatusBar>
        <Wrapper>5a9fg352</Wrapper>
        <ContactUsButton />
        <StatusButton appStatus={"CONNECTED"} />
      </StatusBar>
    </FooterWrapper>
  </Story>
))

storiesFooter.add("Contact Us Button", () => (
  <Story>
    <Flex>
      <ContactUsButton />
    </Flex>
  </Story>
))

storiesFooter.add("Version", () => (
  <Story>
    <Flex>
      <Wrapper>5a9fg352</Wrapper>
    </Flex>
  </Story>
))

const storiesButton = storiesOf("StatusButton", module)

storiesButton.add("Connected", () => (
  <Story>
    <Flex>
      <StatusButton appStatus={"CONNECTED"} />
    </Flex>
  </Story>
))

storiesButton.add("Connecting", () => (
  <Story>
    <Flex>
      <StatusButton appStatus={"CONNECTING"} />
    </Flex>
  </Story>
))

storiesButton.add("Disconnected", () => (
  <Story>
    <Flex>
      <StatusButton appStatus={"DISCONNECTED"} />
    </Flex>
  </Story>
))
