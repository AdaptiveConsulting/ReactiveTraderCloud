import { useEffect, useState } from "react"
import styled from "styled-components"
import { Button } from "@/App/Footer/common-styles"
import { PlatformLockedStatusIcon } from "../icons/PlatformLockedStatusIcon"
import { createOpenFinPopup, Offset, showOpenFinPopup } from "../utils/window"
import { constructUrl } from "@/utils/url"

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
`

const WINDOW = {
  name: "snapshots",
  height: 249,
  width: 245,
}

const OFFSET: Offset = [119, 40]

export const SnapshotButton: React.FC = () => {
  const [showing, setShowing] = useState(false)

  useEffect(() => {
    createOpenFinPopup(WINDOW, constructUrl("/snapshots"), () =>
      setShowing(false),
    )
  }, [])

  const handleShowPopup = () => {
    if (!showing) {
      setShowing(true)
      showOpenFinPopup(WINDOW, OFFSET)
    }
  }

  return (
    <Button onClick={handleShowPopup}>
      <IconContainer>
        <PlatformLockedStatusIcon />
      </IconContainer>
      Snapshots
    </Button>
  )
}
