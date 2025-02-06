import * as icons from "."

export default {
  title: "Components/Icons",
  component: icons,
}

// stories can no longer be created dynamically as CSF are statically defined
// https://github.com/storybookjs/storybook/discussions/12700

export const aeronLogo = {
  render: () => icons.AeronLogo,
  name: "AeronLogo",
}
export const appleShareIcon = {
  render: () => icons.AppleShareIcon,
  name: "AppleShareIcon",
}
export const arrowDownIcon = {
  render: () => icons.ArrowDownIcon,
  name: "ArrowDownIcon",
}
export const arrowUpIcon = {
  render: () => icons.ArrowUpIcon,
  name: "ArrowUpIcon",
}
export const binIcon = {
  render: () => icons.BinIcon,
  name: "BinIcon",
}
export const chartIcon = {
  render: () => icons.ChartIcon,
  name: "ChartIcon",
}
export const checkCircleIcon = {
  render: () => icons.CheckCircleIcon,
  name: "CheckCircleIcon",
}
export const chevronIcon = {
  render: () => icons.ChevronIcon,
  name: "ChevronIcon",
}
export const crossIcon = {
  render: () => icons.CrossIcon,
  name: "CrossIcon",
}
export const darkThemeIcon = {
  render: () => icons.DarkThemeIcon,
  name: "DarkThemeIcon",
}
export const lightThemeIcon = {
  render: () => icons.LightThemeIcon,
  name: "LightThemeIcon",
}
export const downloadIcon = {
  render: () => icons.DownloadIcon,
  name: "DownloadIcon",
}
export const filterEditIcon = {
  render: () => icons.FilterEditIcon,
  name: "FilterEditIcon",
}
export const filterIcon = {
  render: () => icons.FilterIcon,
  name: "FilterIcon",
}
export const popInIcon = {
  render: () => icons.PopInIcon,
  name: "PopInIcon",
}
export const popOutIcon = {
  render: () => icons.PopOutIcon,
  name: "PopOutIcon",
}
export const searchIcon = {
  render: () => icons.SearchIcon,
  name: "SearchIcon",
}
