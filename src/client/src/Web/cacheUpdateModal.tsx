import { createRoot } from "react-dom/client"
import styled from "styled-components"

import { Modal } from "@/components/Modal"
import { ThemeProvider, TouchableIntentName } from "@/theme"

const Buttons = styled.button`
  display: flex;
  margin-top: 20px;
`

// TODO - Use component from styleguide when available
const Button = styled.button<{ intent: TouchableIntentName }>`
  background-color: ${({ theme, intent }) =>
    theme.button[intent].backgroundColor};
  color: #ffffff;
  padding: 5px 9px;
  margin-right: 10px;
  border-radius: 4px;
  font-size: 0.6875rem;

  &:hover {
    background-color: ${({ theme }) => theme.accents.primary.darker};
  }
`

export const showCacheUpdateModal = () => {
  const updateRoot = document.createElement("div")
  document.body.appendChild(updateRoot)

  const root = createRoot(updateRoot)

  root.render(
    <ThemeProvider>
      <Modal title="New updates are available" shouldShow>
        <p>Reload the page to see them.</p>
        <Buttons>
          <Button onClick={() => window.location.reload()} intent="primary">
            Reload
          </Button>
          <Button
            onClick={() => {
              document.body.removeChild(updateRoot)
            }}
            intent="secondary"
          >
            Cancel
          </Button>
        </Buttons>
      </Modal>
    </ThemeProvider>,
  )
}
