export default class PopoutOptions {
  key:string;
  url:string;
  title:string;
  onClosing:() => void;
  windowOptions:{
    width: number,
    height: number,
    resizable: string,
    scrollable: string
  };
  constructor(
    key:string,
    url:string,
    title:string,
    onClosing,
    windowOptions: {width: number, height: number, resizable: string, scrollable: string}
  ) {
    this.key = key;
    this.url = url || 'about:blank';
    this.title = title;
    this.onClosing = onClosing;
    this.windowOptions = windowOptions;
  }
}
