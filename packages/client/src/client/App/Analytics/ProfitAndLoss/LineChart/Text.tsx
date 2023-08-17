import { WithChildren } from "client/utils/utilityTypes"

export const Text = ({
  children,
  x,
  y,
  textAnchor = "middle",
}: {
  x: number
  y: number
  textAnchor?: "middle" | "start" | "end"
} & WithChildren) => (
  <text
    style={{ fontSize: "12px" }}
    x={x}
    y={y}
    stroke="none"
    fill="#666"
    textAnchor={textAnchor}
  >
    {children}
  </text>
)
