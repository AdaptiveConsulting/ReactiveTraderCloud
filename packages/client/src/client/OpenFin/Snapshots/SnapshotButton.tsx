import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

import { Button } from "@/client/components/Button"
import { constructUrl } from "@/client/utils/constructUrl"

import { createOpenFinPopup, Offset, showOpenFinPopup } from "../utils/window"

// const IconContainer = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   width: 1rem;
//   height: 1rem;
//   margin-right: 0.5rem;
// `

const snapshotWindowInfo = {
  name: "snapshots",
  height: 249,
  width: 245,
}

const offsetFromMain: Offset = [119, 40]

export const SnapshotButton = () => {
  const [showing, setShowing] = useState(false)
  const queryString = useLocation().search

  useEffect(() => {
    createOpenFinPopup(
      snapshotWindowInfo,
      constructUrl(`/snapshots${queryString}`),
      () => setShowing(false),
    )
  }, [queryString])

  const handleShowPopup = () => {
    if (!showing) {
      setShowing(true)
      showOpenFinPopup(snapshotWindowInfo, offsetFromMain)
    }
  }

  return (
    <Button variant="primary" size="sm" onClick={handleShowPopup}>
      {/* <IconContainer>
        <PlatformLockedStatusIcon />
      </IconContainer> TODO add icon support to button */}
      Snapshots
    </Button>
  )
}
