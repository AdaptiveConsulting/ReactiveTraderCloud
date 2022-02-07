export const Text: React.FC<{
  x: number
  y: number
  textAnchor?: "middle" | "start" | "end"
}> = ({ children, x, y, textAnchor = "middle" }) => (
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
