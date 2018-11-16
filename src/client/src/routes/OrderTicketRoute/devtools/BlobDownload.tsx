import * as React from 'react'

interface Props extends React.AnchorHTMLAttributes<{}> {
  blob: Blob
  force?: boolean
}
interface State {
  blob?: Blob
  url?: string
}

class BlobDownload extends React.PureComponent<Props, State> {
  state: State = {}

  anchorRef = React.createRef<HTMLAnchorElement>()

  static getDerivedStateFromProps({ blob }: Props, state: State) {
    if (blob === state.blob) {
      return null
    }

    if (state.url) {
      URL.revokeObjectURL(state.url)
    }

    return { blob, url: URL.createObjectURL(blob) }
  }

  componentDidMount = () => {
    if (this.props.force && this.anchorRef) {
      this.anchorRef.current.click()
    }
  }

  componentWillUnmount() {
    if (this.state.url) {
      URL.revokeObjectURL(this.state.url)
    }
  }

  stopPropagation = (event: React.SyntheticEvent) => event.stopPropagation()

  public render() {
    const { blob, force, ...props } = this.props

    return this.state.url ? (
      <a {...props} href={this.state.url} ref={this.anchorRef} onClick={this.stopPropagation} />
    ) : null
  }
}

export default BlobDownload
export { BlobDownload }
