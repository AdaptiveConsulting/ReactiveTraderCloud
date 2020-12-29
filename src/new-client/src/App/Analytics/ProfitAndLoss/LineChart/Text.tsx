export const Text: React.FC<{ x: number; y: number }> = ({
  children,
  x,
  y,
}) => (
  <text
    style={{ fontSize: "12px" }}
    x={x}
    y={y}
    stroke="none"
    fill="#666"
    textAnchor="middle"
  >
    {children}
  </text>
)
