import OpenFin from "@openfin/core"
import { useState } from "react"

import {
  applySnapshotFromStorage,
  AppName,
  getSnapshots,
  saveSnapshotToStorage,
  useAppNameForSnapshots,
} from "../utils/layout"
import {
  Button,
  Container,
  Empty,
  Entry,
  Fieldset,
  Form,
  Input,
  List,
  Title,
} from "./Snapshots.styles"

const useSnapshots = (app: AppName) => {
  const [snapshots, setSnapshots] = useState(() => getSnapshots(app))

  const saveSnapshot = async (name: string) => {
    await saveSnapshotToStorage(app, name)
    setSnapshots(getSnapshots(app))
  }

  const applySnapshot = async (name: string) => {
    await applySnapshotFromStorage(app, name)
  }

  return {
    snapshots,
    saveSnapshot,
    applySnapshot,
  }
}

interface ListProps {
  snapshots: Record<string, OpenFin.Snapshot>
  onSelect(name: string): void
}

const SnapshotList = ({ snapshots, onSelect }: ListProps) => {
  const names = Object.keys(snapshots)

  return (
    <List>
      <Title>Restore a snapshot</Title>

      {!names.length && <Empty>You have no layout snapshots</Empty>}

      {names.map((name) => (
        <Entry key={name} onClick={() => onSelect(name)}>
          {name}
        </Entry>
      ))}
    </List>
  )
}

const EMPTY = /^\s*$/

interface FormProps {
  onSubmit(value: string): void
}

const SnapshotForm = ({ onSubmit }: FormProps) => {
  const [value, setValue] = useState("")

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setValue(evt.currentTarget.value)
  }

  const handleSubmit = () => {
    if (!EMPTY.test(value)) {
      onSubmit(value)
      setValue("")
    }
  }

  const handleKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === "Enter") {
      handleSubmit()
    }
  }

  return (
    <Form>
      <Title>Save new snapshot</Title>

      <Fieldset>
        <Input
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Name"
        />

        <Button onClick={handleSubmit}>Save</Button>
      </Fieldset>
    </Form>
  )
}

export const Snapshots = () => {
  const app = useAppNameForSnapshots()
  const { snapshots, saveSnapshot, applySnapshot } = useSnapshots(app)

  return (
    <Container>
      <SnapshotList snapshots={snapshots} onSelect={applySnapshot} />
      <SnapshotForm onSubmit={saveSnapshot} />
    </Container>
  )
}
