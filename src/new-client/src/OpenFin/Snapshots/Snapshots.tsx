import { Snapshot } from "openfin/_v2/shapes/Platform"
import { useState } from "react"
import {
  applySnapshotFromStorage,
  getSnapshots,
  saveSnapshotToStorage,
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

const useSnapshots = () => {
  const [snapshots, setSnapshots] = useState(() => getSnapshots())

  const saveSnapshot = async (name: string) => {
    await saveSnapshotToStorage(name)
    setSnapshots(getSnapshots())
  }

  const applySnapshot = async (name: string) => {
    await applySnapshotFromStorage(name)
  }

  return {
    snapshots,
    saveSnapshot,
    applySnapshot,
  }
}

interface ListProps {
  snapshots: Record<string, Snapshot>
  onSelect(name: string): void
}

const SnapshotList: React.FC<ListProps> = ({ snapshots, onSelect }) => {
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

const SnapshotForm: React.FC<FormProps> = ({ onSubmit }) => {
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

export const Snapshots: React.FC = () => {
  const { snapshots, saveSnapshot, applySnapshot } = useSnapshots()

  console.log(snapshots)

  return (
    <Container>
      <SnapshotList snapshots={snapshots} onSelect={applySnapshot} />
      <SnapshotForm onSubmit={saveSnapshot} />
    </Container>
  )
}
