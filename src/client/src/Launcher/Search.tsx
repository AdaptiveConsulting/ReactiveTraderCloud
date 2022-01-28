import { useEffect, useRef } from "react"
import { setInput, onResetInput } from "./services/nlpService"
import { SearchContainer, Input, CancelButton } from "./styles"
import { ExitIcon } from "./icons"

type Props = {
  value: string
  visible?: boolean
  onHide: () => void
}

export const Search: React.FC<Props> = ({ value, visible, onHide }) => {
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
  }, [])

  useEffect(() => {
    if (visible) {
      inputRef.current!.focus()
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
            inputRef.current!.focus()
          }}
        >
          <ExitIcon />
        </CancelButton>
      )}
    </SearchContainer>
  )
}
