declare module 'symphony-api-client-node' {
  export interface Message {
    messageText: string
    stream: Stream
    user: User
  }
  export interface User {
    firstName: string
  }

  export function setDebugMode(x: boolean): void

  export interface Stream {
    streamId: string
  }

  export function createRoom(
    roomName: string,
    descript: string,
    kWord: string[],
    membersCanInvite: boolean,
    discoverable: boolean,
    pubLic: boolean,
    readOnly: boolean,
    copyProtected: boolean,
    crossPod: boolean,
    viewHistory: boolean
  ): Promise<{ code: number; roomSystemInfo: { id: string } }>

  export type MessageFormat = 'presentationML' | 'messageML'
  export function sendMessage(
    conversationId: string,
    message: string,
    data: string | null,
    format: MessageFormat
  ): Promise<{ code: number }>
  export const MESSAGEML_FORMAT: 'messageML'
  export const PRESENTATIONML_FORMAT: 'presentationML'

  export function initBot(dir: string): Promise<any>

  export interface FeedParams {
    onMessage: (message: Message[]) => void
    onError?: (error: any) => void
    onCreated?: (id: string) => void
    feedId?: string
  }
  export function getDatafeedEventsService(
    config: ((event: string, messages: Message[]) => void) | FeedParams
  )
}
