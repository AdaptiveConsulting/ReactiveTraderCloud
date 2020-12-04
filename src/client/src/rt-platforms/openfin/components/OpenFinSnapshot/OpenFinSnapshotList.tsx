import React, { KeyboardEventHandler, useCallback, useEffect, useState } from 'react'
import {
  ErrorAlert,
  FormControl,
  TextInput,
  TextInputLabel,
  SnapshotList,
  SnapshotListTitle,
  SnapshotName,
  SnapshotRoot,
  Background,
} from './styled'
import { applySnapshotFromStorage, getSnapshotNames, saveSnapshotToStorage } from './utils'

type SnapshotError = {
  message: string
  topic: 'save' | 'load'
}

const OpenFinSnapshotList: React.FC = props => {
  const [isLoading, setIsLoading] = useState<string>('')
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [newSnapshotName, setNewSnapshotName] = useState<string>('')
  const [snapshotError, setSnapshotError] = useState<SnapshotError>()

  const textInputRef = useCallback((node: any) => {
    if (!!node) {
      node.addEventListener('focus', () => setSnapshotError(undefined))
    }
  }, [])

  useEffect(() => {
    if (isSaving && newSnapshotName) {
      saveSnapshotToStorage(newSnapshotName)
        .then(() => {
          setSnapshotError(undefined)
          setNewSnapshotName('')
          setIsSaving(false)
        })
        .catch((ex: Error) => {
          console.error(ex)
          setSnapshotError({ topic: 'save', message: 'Failed to take snapshot.' })
          setIsSaving(false)
        })
    }
  }, [isSaving, newSnapshotName])

  useEffect(() => {
    if (isLoading) {
      applySnapshotFromStorage(isLoading)
        .then(() => {
          setSnapshotError(undefined)
          setNewSnapshotName('')
          setIsLoading('')
        })
        .catch((ex: Error) => {
          console.error(ex)
          setSnapshotError({ topic: 'load', message: `Failed to load snapshot ${isLoading}.` })
          setIsLoading('')
        })
    }
  }, [isLoading])

  const snapshotListContent = () => {
    const snapshotNames = getSnapshotNames()
    if (snapshotNames.length) {
      return snapshotNames.sort().map((snapshotName: string, idx: number) => {
        return (
          <SnapshotRoot key={`snapshot_${idx}`} onClick={e => selectSnapshot(snapshotName)}>
            <SnapshotName>{snapshotName}</SnapshotName>
          </SnapshotRoot>
        )
      })
    } else {
      return <SnapshotRoot isActive={true}>No saved snapshots.</SnapshotRoot>
    }
  }

  const selectSnapshot = (snapshotName: string) => {
    setIsLoading(snapshotName)
  }

  const handleSnapshotSubmission: KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.key === 'Enter' && !!newSnapshotName && !getSnapshotNames().includes(newSnapshotName)) {
      e.preventDefault()
      setIsSaving(true)
    }
  }

  return (
    <Background>
      <SnapshotList>
        <SnapshotListTitle>Restore a snapshot</SnapshotListTitle>
        {snapshotListContent()}
        <SnapshotErrorAlert snapshotError={snapshotError} topics={['load']} />
      </SnapshotList>
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
        <SnapshotErrorAlert snapshotError={snapshotError} topics={['save']} />
      </FormControl>
    </Background>
  )
}

const SnapshotErrorAlert: React.FC<{
  snapshotError: SnapshotError | undefined
  topics: string[]
}> = ({ snapshotError, topics }) => {
  if (!!snapshotError && topics.includes(snapshotError.topic)) {
    return <ErrorAlert>{snapshotError.message}</ErrorAlert>
  }
  return null
}

export default OpenFinSnapshotList
