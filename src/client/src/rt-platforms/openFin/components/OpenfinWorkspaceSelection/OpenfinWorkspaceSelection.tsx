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
  FormControl,
  HrBar,
  Root,
  StatusCircle,
  TextInput,
  TextInputLabel,
  WorkspaceList,
  WorkspaceListTitle,
  WorkspaceName,
  WorkspaceRoot,
} from './styled'
import { Flex, Modal } from 'rt-components'
import { WorkspaceActiveStatus } from 'rt-types'
import { finWithPlatform } from '../../OpenFinWithPlatform'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const WORKSPACE_DEFAULT_NAME = 'RTC Default Workspace'
const WORKSPACE_CURRENT_KEY = 'OPENFIN_WORKSPACE_CURRENT'
const WORKSPACE_NAMES_KEY = 'OPENFIN_WORKSPACE_NAMES'
const WORKSPACE_SNAPSHOTS_KEY = 'OPENFIN_WORKSPACE_SNAPSHOTS'

const OpenfinWorkspaceSelection: React.FC = props => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [currentWorkspace, setCurrentWorkspace] = useState<string>(() => {
    return window.localStorage.getItem(WORKSPACE_CURRENT_KEY) || ''
  })
  const [newWorkspace, setNewWorkspace] = useState<string>('')
  const [isLoading, setIsLoading] = useState<string>('')
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [workspaces, setWorkspaces] = useState<string[]>(() => {
    const workspaces = window.localStorage.getItem(WORKSPACE_NAMES_KEY)
    if (workspaces) {
      return JSON.parse(workspaces)
    }
    return []
  })

  const toggleOpen = useCallback(
    async (event: SyntheticEvent) => {
      const isAppUrl = (element: any) => element instanceof HTMLInputElement
      if (!isAppUrl(event.target)) {
        const currWin = await fin.Window.getCurrent()
        const views = await currWin.getCurrentViews()
        if (isOpen) {
          views.forEach(v => v.show())
          setNewWorkspace('')
        } else {
          views.forEach(v => v.hide())
        }
        setIsOpen(!isOpen)
      }
    },
    [isOpen, setIsOpen],
  )

  const workspaceListContent = useMemo(() => {
    if (workspaces.length) {
      return workspaces.sort().map((workspace: string, idx: number) => (
        <WorkspaceRoot key={`workspace_${idx}`} onClick={e => selectWorkspace(workspace)}>
          <StatusCircle
            status={
              workspace === currentWorkspace
                ? WorkspaceActiveStatus.ACTIVE
                : WorkspaceActiveStatus.INACTIVE
            }
          />
          <WorkspaceName>{workspace}</WorkspaceName>
        </WorkspaceRoot>
      ))
    } else {
      return <WorkspaceRoot>No saved workspaces.</WorkspaceRoot>
    }
  }, [workspaces, currentWorkspace])

  useEffect(() => {
    if (!!workspaces && !workspaces.length) {
      finWithPlatform.Platform.getCurrent()
        .then((platform: any) => {
          return platform.getSnapshot()
        })
        .then((snapshot: any) => {
          window.localStorage.setItem(WORKSPACE_NAMES_KEY, JSON.stringify([WORKSPACE_DEFAULT_NAME]))
          window.localStorage.setItem(
            WORKSPACE_SNAPSHOTS_KEY,
            JSON.stringify({ [WORKSPACE_DEFAULT_NAME]: snapshot }),
          )
          window.localStorage.setItem(WORKSPACE_CURRENT_KEY, WORKSPACE_DEFAULT_NAME)
          setWorkspaces([WORKSPACE_DEFAULT_NAME])
          setCurrentWorkspace(WORKSPACE_DEFAULT_NAME)
        })
    }
  }, [workspaces])

  useEffect(() => {
    if (isSaving) {
      finWithPlatform.Platform.getCurrent()
        .then((platform: any) => {
          return platform.getSnapshot()
        })
        .then((snapshot: any) => {
          const snapshots = window.localStorage.getItem(WORKSPACE_SNAPSHOTS_KEY)
          const snapshotsJson = JSON.parse(snapshots || '{}')
          const updatedWorkspaces = [...workspaces, newWorkspace]
          window.localStorage.setItem(WORKSPACE_NAMES_KEY, JSON.stringify(updatedWorkspaces))
          window.localStorage.setItem(
            WORKSPACE_SNAPSHOTS_KEY,
            JSON.stringify({ ...snapshotsJson, [newWorkspace]: snapshot }),
          )
          window.localStorage.setItem(WORKSPACE_CURRENT_KEY, newWorkspace)
          setIsSaving(false)
          setWorkspaces(updatedWorkspaces)
          setNewWorkspace('')
          setCurrentWorkspace(newWorkspace)
        })
    }
  }, [isSaving, newWorkspace, workspaces])

  useEffect(() => {
    if (isLoading) {
      //@ts-ignore
      finWithPlatform.Platform.getCurrent().then((platform: any) => {
        const snapshots = window.localStorage.getItem(WORKSPACE_SNAPSHOTS_KEY)
        const snapshotsJson = JSON.parse(snapshots || '{}')
        platform.applySnapshot(snapshotsJson[isLoading], { closeExistingWindows: true })
        window.localStorage.setItem(WORKSPACE_CURRENT_KEY, isLoading)
        setIsLoading('')
        setCurrentWorkspace(isLoading)
      })
    }
  }, [isLoading])

  const handleWorkspaceSubmission: KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.key === 'Enter' && !!newWorkspace && newWorkspace !== WORKSPACE_DEFAULT_NAME) {
      e.preventDefault()
      setIsSaving(true)
    }
  }

  const selectWorkspace = async (workspace: string) => {
    setIsLoading(workspace)
  }

  return (
    <Root>
      <Button onClick={toggleOpen} data-qa="workspaces-button__toggle-button">
        {currentWorkspace || 'My workspaces'}
      </Button>
      <Modal
        shouldShow={isOpen}
        onOverlayClick={toggleOpen}
        title={
          <Flex justifyContent="space-between">
            <div>My workspaces</div>
            <CloseButton accent="bad" onClick={toggleOpen} data-qa="openfin-chrome__close">
              <FontAwesomeIcon icon={faTimes} />
            </CloseButton>
          </Flex>
        }
      >
        <Flex direction="column">
          <WorkspaceList>
            <WorkspaceListTitle>Restore a saved workspace</WorkspaceListTitle>
            {workspaceListContent}
          </WorkspaceList>
          <HrBar />
          <FormControl>
            <TextInputLabel>Save current workspace as</TextInputLabel>
            <TextInput
              disabled={isSaving}
              placeholder="Workspace Name"
              value={newWorkspace}
              onChange={e => setNewWorkspace(e.target.value)}
              onKeyDown={handleWorkspaceSubmission}
            />
          </FormControl>
        </Flex>
      </Modal>
    </Root>
  )
}

export default OpenfinWorkspaceSelection
