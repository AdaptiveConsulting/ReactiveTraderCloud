import { createRoot } from "react-dom/client"

import { Modal } from "@/client/components/Modal"
import { ThemeProvider } from "@/client/theme"

import { Button } from "../components/Button"
import { Stack } from "../components/Stack"

export const showCacheUpdateModal = () => {
  const updateRoot = document.createElement("div")
  document.body.appendChild(updateRoot)

  const root = createRoot(updateRoot)

  console.log("Showing service worker modal")

  root.render(
    <ThemeProvider>
      <Modal title="New updates are available" shouldShow>
        <p>Reload the page to see them.</p>
        <Stack marginTop={20}>
          <Button
            onClick={() => window.location.reload()}
            variant="brand"
            size="lg"
          >
            Reload
          </Button>
          <Button
            onClick={() => {
              document.body.removeChild(updateRoot)
            }}
            variant="primary"
            size="lg"
          >
            Cancel
          </Button>
        </Stack>
      </Modal>
    </ThemeProvider>,
  )
}
