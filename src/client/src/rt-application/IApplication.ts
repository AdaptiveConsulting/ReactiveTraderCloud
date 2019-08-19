export default interface IApplication {
  run<T>(): Promise<T>
}
