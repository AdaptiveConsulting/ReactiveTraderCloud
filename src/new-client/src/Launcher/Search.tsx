import { useEffect, useRef } from "react"
import { setInput, useNlpInput, onResetInput } from "./services/nlpService"
import { SearchContainer, Input, CancelButton } from "./styles"
import { ExitIcon } from "./icons"

export const Search: React.FC<{ visible?: boolean }> = ({ visible }) => {
  const value = useNlpInput()
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !e.repeat) {
        onResetInput()
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
    <SearchContainer className={visible ? "search-container--active" : ""}>
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => {
          setInput(e.target.value)
        }}
        placeholder="Type something"
      />

      {false && (
        <CancelButton onClick={() => {}}>
          <ExitIcon />
        </CancelButton>
      )}
    </SearchContainer>
  )
}
