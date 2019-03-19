export declare abstract class RpcDispatcher implements EventTarget {
    protected static messageId: number;
    protected static promiseExecutors: {
        [messageId: number]: {
            resolve: Function;
            reject: Function;
        };
    };
    connectionUuid: string;
    listeners: {
        [eventType: string]: Function[];
    };
    addEventListener(type: string, listener: (data?: any) => any): void;
    removeEventListener(type: string, listener: (data?: any) => any): void;
    private hasEventListener;
    dispatchEvent(evt: Event): boolean;
    dispatchEvent(typeArg: string, data?: any): boolean;
    getDefaultMessage(): any;
    protected invokeExcelCall(functionName: string, data?: any, callback?: Function): Promise<any>;
    protected invokeServiceCall(functionName: string, data?: any, callback?: Function): Promise<any>;
    private invokeRemoteCall;
    protected applyCallbackToPromise(promise: Promise<any>, callback: Function): Promise<any>;
    abstract toObject(): any;
}
