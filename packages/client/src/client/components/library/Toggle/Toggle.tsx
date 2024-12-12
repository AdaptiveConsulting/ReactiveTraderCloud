import "./toggle.css"

import { Typography } from "../Typography"

interface Props {
  left: string
  right: string
  isToggled: boolean
  onChange: () => void
}

export const Toggle = ({ left, right, onChange, isToggled }: Props) => (
  <div className="toggle-container">
    <button onClick={onChange}>
      <Typography
        variant="Text md/Semibold"
        color={
          isToggled
            ? "Colors/Text/text-quaternary (500)"
            : "Colors/Text/text-primary_alt"
        }
      >
        {left}
      </Typography>
    </button>
    <button onClick={onChange}>
      <Typography
        variant="Text md/Semibold"
        color={
          isToggled
            ? "Colors/Text/text-primary (900)"
            : "Colors/Text/text-quaternary (500)"
        }
      >
        {right}
      </Typography>
    </button>
    <div className={`indicator ${isToggled && "toggled"}`} />
  </div>
)
