import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  SyntheticEvent,
  KeyboardEventHandler,
} from 'react'
import {
  Button,
  FormControl,
  HrBar,
  Root,
  TextInput,
  TextInputLabel,
  WorkspaceList,
  WorkspaceListPopup,
  WorkspaceName,
  WorkspaceRoot,
} from './styled'
import { ServiceConnectionStatus } from 'rt-types'
import { StatusCircle } from '../../../../apps/MainRoute/widgets/status-connection/styled'

interface ExtendedFin {
  Platform: any;
}

// apply additional types to fabric and export it for usage
export const FinWithPlatform: (ExtendedFin & typeof fin) = fin as any;

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
    return [];
  })

  const toggleOpen = useCallback(
    (event: SyntheticEvent) => {
      const isAppUrl = (element: any) => element instanceof HTMLInputElement
      if (!isAppUrl(event.target)) {
        if (isOpen) {
          setNewWorkspace('')
        }
        setIsOpen(!isOpen)
      }
    },
    [isOpen, setIsOpen],
  )

  const workspaceListContent = useMemo(() => {
    if (workspaces.length) {
      return workspaces.map((workspace: string, idx: number) => (
          <WorkspaceRoot key={`workspace_${idx}`} onClick={e => selectWorkspace(workspace)}>
            {console.log('-------------------->', workspace, currentWorkspace)}
            {workspace === currentWorkspace && <StatusCircle status={ServiceConnectionStatus.CONNECTED} />}
            <WorkspaceName>{workspace}</WorkspaceName>
          </WorkspaceRoot>
        ))
    } else {
      return <WorkspaceRoot>No saved workspaces.</WorkspaceRoot>
    }
  }, [workspaces, currentWorkspace])

  useEffect(() => {
    if (isSaving) {
      FinWithPlatform.Platform.getCurrent()
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
      FinWithPlatform.Platform.getCurrent().then((platform: any) => {
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
    if (!!newWorkspace && e.key === 'Enter') {
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
      <WorkspaceListPopup open={isOpen} onClick={toggleOpen}>
        <WorkspaceList>
          {workspaceListContent}
        </WorkspaceList>
        <HrBar />
        <FormControl>
          <TextInputLabel>Save current workspace as</TextInputLabel>
          <TextInput
            disabled={isSaving}
            value={newWorkspace}
            onChange={e => setNewWorkspace(e.target.value)}
            onKeyDown={handleWorkspaceSubmission}
          />
        </FormControl>
      </WorkspaceListPopup>
    </Root>
  )
}

export default OpenfinWorkspaceSelection
