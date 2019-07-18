 

declare module 'symphony-api-client-node' {

    export interface Message {
        messageText:string 
        stream:Stream
        user:User
    }
    export interface User{
        firstName:string
    }

    export function setDebugMode(x:boolean):void
    
    export interface Stream {
        streamId:string
    }

    export function createRoom(roomName: string, 
        descript: string, 
        kWord: string[],
        membersCanInvite: boolean, 
        discoverable: boolean, 
        pubLic: boolean, 
        readOnly: boolean, 
        copyProtected: boolean,
        crossPod: boolean, 
        viewHistory: boolean
    ): Promise<{ code: number, roomSystemInfo:{id:string} }>;
    export function sendMessage(...args: any): Promise<{ code: number }>;
    export const MESSAGEML_FORMAT: string

    export function initBot(dir:string):Promise<any>
    export function getDatafeedEventsService(onEvent:(event:string, messages:any)=>void):void
}