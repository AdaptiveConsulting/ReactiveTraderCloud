import { storiesOf } from "@storybook/react"
import styled from "styled-components"
import Header from "./Header"
import Story from "@/stories/Story"
import { User } from "./LoginControls/LoginControls"
import { fakeUsers } from "@/services/currentUser"
import ThemeSwitcher from "./theme-switcher/ThemeSwitcher"
import { Flex } from "@/Web/Web.styles"
import { defaultLogo } from "./Header"
import { PWAInstallModal } from "./PWA/PWAInstallModal"
import { PWAInstallBanner } from "./PWA/PWAInstallPrompt"
import { InstallButton } from "./PWA/PWAInstallPrompt.styles"

const stories = storiesOf("Header", module)
const currentUser = fakeUsers[Math.floor(Math.random() * fakeUsers.length)]

const HeaderWrapper = styled.div`
  width: 100%;
`

stories.add("Header", () => (
  <Story>
    <HeaderWrapper>
      <Header />
    </HeaderWrapper>
  </Story>
))

stories.add("Header Logo", () => (
  <Story>
    <Flex>{defaultLogo}</Flex>
  </Story>
))

stories.add("Login Controls", () => (
  <Story>
    <Flex>
      <User user={currentUser} />
    </Flex>
  </Story>
))

stories.add("Theme Switcher", () => (
  <Story>
    <Flex>
      <ThemeSwitcher />
    </Flex>
  </Story>
))

stories.add("PWA Install Modal", () => (
  <Story>
    <Flex>
      <PWAInstallModal closeModal={() => {}} />
    </Flex>
  </Story>
))

stories.add("PWA Install Banner", () => (
  <Story>
    <Flex>
      <PWAInstallBanner
        banner={"shown"}
        updateBanner={() => {}}
        isModalOpen={false}
        setIsModalOpen={() => {}}
        mocked={true}
      />
    </Flex>
  </Story>
))

stories.add("PWA Launch Banner", () => (
  <Story>
    <Flex>
      <InstallButton>Install PWA</InstallButton>
    </Flex>
  </Story>
))
