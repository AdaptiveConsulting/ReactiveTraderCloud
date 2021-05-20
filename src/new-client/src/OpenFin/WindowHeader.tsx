interface Props {
  title: string
  close?: () => void
  minimize?: () => void
  maximize?: () => void
  popIn?: () => void
}

export const WindowHeader: React.FC<Props> = () => <div />
