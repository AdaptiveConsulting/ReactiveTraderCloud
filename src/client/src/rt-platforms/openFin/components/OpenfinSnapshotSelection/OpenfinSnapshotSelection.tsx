import React, {
  KeyboardEventHandler,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  Button,
  CloseButton,
  ErrorAlert,
  FormControl,
  HrBar,
  Root,
  StatusCircle,
  TextInput,
  TextInputLabel,
  SnapshotList,
  SnapshotListTitle,
  SnapshotName,
  SnapshotRoot,
} from './styled'
import { Flex, Modal } from 'rt-components'
import { SnapshotActiveStatus } from 'rt-types'
import { finWithPlatform } from '../../OpenFinWithPlatform'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const OPENFIN_SNAPSHOT_CURRENT = 'OPENFIN_SNAPSHOT_CURRENT'
const OPENFIN_SNAPSHOT_NAMES = 'OPENFIN_SNAPSHOT_NAMES'
const OPENFIN_SNAPSHOTS = 'OPENFIN_SNAPSHOTS'

const OPENFIN_SNAPSHOT_DEFAULT_NAME = 'RTC Default Snapshot'

type SnapshotError = {
  message: string,
  topic: 'save' | 'load'
}

const OpenfinSnapshotSelection: React.FC = props => {

  const [currentSnapshotName, setCurrentSnapshotName] = useState<string>(() => {
    return window.localStorage.getItem(OPENFIN_SNAPSHOT_CURRENT) || ''
  })
  const [isLoading, setIsLoading] = useState<string>('')
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [newSnapshotName, setNewSnapshotName] = useState<string>('')
  const [snapshotError, setSnapshotError] = useState<SnapshotError>()
  const [snapshotNames, setSnapshotNames] = useState<string[]>(() => {
    const snapshotNamesStr = window.localStorage.getItem(OPENFIN_SNAPSHOT_NAMES)
    if (snapshotNamesStr) {
      return JSON.parse(snapshotNamesStr)
    }
    return []
  })

  const toggleOpen = useCallback(
    async (event: SyntheticEvent) => {
      const isAppUrl = (element: any) => element instanceof HTMLInputElement
      if (!isAppUrl(event.target) && !isLoading && !isSaving) {
        const currWin = await fin.Window.getCurrent()
        const views = await currWin.getCurrentViews()
        if (isOpen) {
          views.forEach(v => v.show())
          setNewSnapshotName('')
          setSnapshotError(undefined)
        } else {
          views.forEach(v => v.hide())
        }
        setIsOpen(!isOpen)
      }
    },
    [isLoading, isOpen, isSaving]
  )

  const textInputRef = useCallback(
    (node: any) => {
      if (!!node) {
        node.addEventListener('focus', () => setSnapshotError(undefined))
      }
    },
    []
  );

  const snapshotListContent = useMemo(
    () => {
      if (snapshotNames.length) {
        return snapshotNames.sort().map((snapshotName: string, idx: number) => (
          <SnapshotRoot key={`snapshot_${idx}`} onClick={e => selectSnapshot(snapshotName)}>
            <StatusCircle
              status={
                snapshotName === currentSnapshotName
                  ? SnapshotActiveStatus.ACTIVE
                  : SnapshotActiveStatus.INACTIVE
              }
            />
            <SnapshotName>{snapshotName}</SnapshotName>
          </SnapshotRoot>
        ))
      } else {
        return <SnapshotRoot>No saved snapshots.</SnapshotRoot>
      }
    },
    [snapshotNames, currentSnapshotName]
  )

  useEffect(
    () => {
      if (!!snapshotNames && !snapshotNames.length) {
        finWithPlatform.Platform.getCurrent()
          .then((platform: any) => platform.getSnapshot())
          .then((snapshot: any) => {
            window.localStorage.setItem(OPENFIN_SNAPSHOT_NAMES, JSON.stringify([OPENFIN_SNAPSHOT_DEFAULT_NAME]))
            window.localStorage.setItem(OPENFIN_SNAPSHOTS, JSON.stringify({ [OPENFIN_SNAPSHOT_DEFAULT_NAME]: snapshot }))
            window.localStorage.setItem(OPENFIN_SNAPSHOT_CURRENT, OPENFIN_SNAPSHOT_DEFAULT_NAME)
            setSnapshotNames([OPENFIN_SNAPSHOT_DEFAULT_NAME])
            setCurrentSnapshotName(OPENFIN_SNAPSHOT_DEFAULT_NAME)
          })
      }
    },
    [snapshotNames]
  )

  useEffect(
    () => {
      if (isSaving) {
        finWithPlatform.Platform.getCurrent()
          .then((platform: any) => platform.getSnapshot())
          .then((snapshot: any) => {
            const snapshotsStr = window.localStorage.getItem(OPENFIN_SNAPSHOTS)
            const snapshots = JSON.parse(snapshotsStr || '{}')
            const updatedSnapshots = [...snapshotNames, newSnapshotName]
            window.localStorage.setItem(OPENFIN_SNAPSHOT_NAMES, JSON.stringify(updatedSnapshots))
            window.localStorage.setItem(OPENFIN_SNAPSHOTS, JSON.stringify({ ...snapshots, [newSnapshotName]: snapshot }))
            window.localStorage.setItem(OPENFIN_SNAPSHOT_CURRENT, newSnapshotName)
            setSnapshotError(undefined)
            setIsSaving(false)
            setSnapshotNames(updatedSnapshots)
            setNewSnapshotName('')
            setCurrentSnapshotName(newSnapshotName)
          })
          .catch((ex: Error) => {
            console.error(ex)
            setSnapshotError({topic: 'save', message: "Failed to take snapshot."})
            setIsSaving(false)
          })
      }
    },
    [isSaving, newSnapshotName, snapshotNames]
  )

  useEffect(
    () => {
      if (isLoading) {
        finWithPlatform.Platform.getCurrent()
          .then((platform: any) => {
            const snapshots = window.localStorage.getItem(OPENFIN_SNAPSHOTS)
            const snapshotsJson = JSON.parse(snapshots || '{}')
            platform.applySnapshot(snapshotsJson[isLoading], { closeExistingWindows: true })
            window.localStorage.setItem(OPENFIN_SNAPSHOT_CURRENT, isLoading)
            setSnapshotError(undefined)
            setCurrentSnapshotName(isLoading)
          })
          .catch((ex: Error) => {
            console.error(ex)
            setSnapshotError({topic: 'load', message: `Failed to load snapshot ${isLoading}.`})
          })
          .finally(() => {
            setIsLoading('')
          })
      }
    },
    [isLoading]
  )

  const handleSnapshotSubmission: KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.key === 'Enter' && !!newSnapshotName && newSnapshotName !== OPENFIN_SNAPSHOT_DEFAULT_NAME) {
      e.preventDefault()
      setIsSaving(true)
    }
  }

  const selectSnapshot = (snapshotName: string) => {
    setIsLoading(snapshotName)
  }

  return <Root>
    <Button onClick={toggleOpen} data-qa="snapshots-button__toggle-button">
      {currentSnapshotName || 'My snapshotNames'}
    </Button>
    <Modal
      shouldShow={isOpen}
      onOverlayClick={toggleOpen}
      title={
        <Flex justifyContent="space-between">
          <div>My snapshots</div>
          <CloseButton accent="bad" onClick={toggleOpen} data-qa="openfin-chrome__close">
            <FontAwesomeIcon icon={faTimes} />
          </CloseButton>
        </Flex>
      }
    >
      <Flex direction="column">
        <SnapshotList>
          <SnapshotListTitle>Restore a snapshot</SnapshotListTitle>
          {snapshotListContent}
          <SnapshotErrorAlert snapshotError={snapshotError} topics={["load"]} />
        </SnapshotList>
        <HrBar />
        <FormControl>
          <TextInputLabel>Take a snapshot</TextInputLabel>
          <TextInput
            ref={textInputRef}
            disabled={isSaving}
            placeholder="Snapshot Name"
            value={newSnapshotName}
            onChange={e => setNewSnapshotName(e.target.value)}
            onKeyDown={handleSnapshotSubmission}
          />
          <SnapshotErrorAlert snapshotError={snapshotError} topics={["save"]} />
        </FormControl>
      </Flex>
    </Modal>
  </Root>
}

const SnapshotErrorAlert: React.FC<{snapshotError: SnapshotError | undefined, topics: string[]}> = ({snapshotError, topics}) => {
  if (!!snapshotError && topics.includes(snapshotError.topic)) {
    return <ErrorAlert>{snapshotError.message}</ErrorAlert>
  }
  return null
}

export default OpenfinSnapshotSelection
