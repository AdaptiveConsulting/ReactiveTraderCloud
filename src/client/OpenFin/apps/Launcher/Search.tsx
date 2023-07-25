import { useEffect, useRef } from "react"

import { ExitIcon } from "./icons"
import { onResetInput, setInput } from "./services/nlpService"
import { CancelButton, Input, SearchContainer } from "./styles"

type Props = {
  value: string
  visible?: boolean
  onHide: () => void
}

export const Search = ({ value, visible, onHide }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !e.repeat) {
        onHide()
      }
    }
    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [onHide])

  useEffect(() => {
    if (visible && inputRef.current) {
      inputRef.current.focus()
    }
  }, [visible])

  return (
    <SearchContainer visible={visible}>
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => {
          setInput(e.target.value)
        }}
        placeholder="Type something"
      />

      {value && (
        <CancelButton
          onClick={() => {
            onResetInput()
            inputRef.current && inputRef.current.focus()
          }}
        >
          <ExitIcon />
        </CancelButton>
      )}
    </SearchContainer>
  )
}
