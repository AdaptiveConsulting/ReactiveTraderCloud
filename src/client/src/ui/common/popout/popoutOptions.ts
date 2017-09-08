export default class PopoutOptions {
  key
  url
  title
  onClosing
  windowOptions
  constructor(
    key,
    url,
    title,
    onClosing,
    windowOptions,
  ) {
    this.key = key
    this.url = url || 'about:blank'
    this.title = title
    this.onClosing = onClosing
    this.windowOptions = windowOptions
  }
}
