import "./button.css"

import { PropsWithChildren } from "react"

import { Typography } from "../Typography"

interface Props {
  variant: "brand" | "primary" | "warning" | "outline"
  size: "xxs" | "xs" | "sm" | "lg"
  disabled?: boolean
  onClick: () => void
}

export const Button = ({
  children,
  size,
  variant,
  ...props
}: PropsWithChildren<Props>) => (
  <button className={`button-container ${variant} ${size}`} {...props}>
    <Typography
      variant={size === "xxs" ? "Text xxs/Regular" : "Text sm/Semibold"}
    >
      {children}
    </Typography>
  </button>
)
