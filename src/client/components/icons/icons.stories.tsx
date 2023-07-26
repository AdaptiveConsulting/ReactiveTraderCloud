import * as icons from "."

export default {
  title: "Components/Icons",
  component: icons,
}

// stories can no longer be created dynamically as CSF are statically defined
// https://github.com/storybookjs/storybook/discussions/12700

export const appleShareIcon = {
  render: () => icons.AppleShareIcon,
  name: "AppleShareIcon",
}
export const chartIcon = {
  render: () => <icons.ChartIcon />,
  name: "ChartIcon",
}
export const chevronIcon = {
  render: () => icons.ChevronIcon,
  name: "ChevronIcon",
}
export const crossIcon = {
  render: () => icons.CrossIcon,
  name: "CrossIcon",
}
export const downloadIcon = {
  render: () => icons.DownloadIcon,
  name: "DownloadIcon",
}
export const expandIcon = {
  render: () => <icons.ExpandIcon />,
  name: "ExpandIcon",
}
export const filterIcon = {
  render: () => icons.FilterIcon,
  name: "FilterIcon",
}
export const logoIcon = {
  render: (args: { width: number; height: number }) => (
    <icons.LogoIcon {...args} />
  ),
  name: "LogoIcon",
}
export const mailIcon = {
  render: (args: { fill: string; size: number }) => (
    <icons.MailIcon {...args} />
  ),
  name: "MailIcon",
}
export const maximizeIcon = {
  render: () => icons.MaximizeIcon,
  name: "MaximizeIcon",
}
export const popInIcon = {
  render: () => <icons.PopInIcon />,
  name: "PopInIcon",
}
export const popOutIcon = {
  render: () => <icons.PopOutIcon />,
  name: "PopOutIcon",
}
export const unDockIcon = {
  render: (args: { width: number; height: number }) => (
    <icons.UndockIcon {...args} />
  ),
  name: "UndockIcon",
}
