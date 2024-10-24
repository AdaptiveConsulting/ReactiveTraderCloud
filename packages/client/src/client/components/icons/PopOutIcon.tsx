import type { ReactiveTraderIcon } from "./types"

export const PopOutIcon = ({
  width = 16,
  height = 16,
  stroke = "#737373",
}: ReactiveTraderIcon) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.58331 6.41663L12.3666 1.6333"
      stroke={stroke}
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.8333 3.96663V1.16663H10.0333"
      stroke={stroke}
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.41669 1.16663H5.25002C2.33335 1.16663 1.16669 2.33329 1.16669 5.24996V8.74996C1.16669 11.6666 2.33335 12.8333 5.25002 12.8333H8.75002C11.6667 12.8333 12.8334 11.6666 12.8334 8.74996V7.58329"
      stroke={stroke}
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
