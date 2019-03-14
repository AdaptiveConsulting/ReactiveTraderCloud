import { RpcDispatcher } from './RpcDispatcher';
import { ExcelApplication } from './ExcelApplication';
export declare class ExcelService extends RpcDispatcher {
    static instance: ExcelService;
    defaultApplicationUuid: string;
    defaultApplicationObj: ExcelApplication;
    initialized: boolean;
    applications: {
        [connectionUuid: string]: ExcelApplication;
    };
    constructor();
    init(): Promise<void>;
    processExcelServiceEvent: (data: any) => Promise<void>;
    processExcelServiceResult: (result: any) => Promise<void>;
    subscribeToServiceMessages(): Promise<[void, void]>;
    monitorDisconnect(): Promise<{}>;
    registerWindowInstance: (callback?: Function) => Promise<any>;
    configureDefaultApplication(): Promise<void>;
    processExcelConnectedEvent(data: any): Promise<void>;
    processExcelDisconnectedEvent(data: any): Promise<void>;
    processGetExcelInstancesResult(connectionUuids: string[]): Promise<void>;
    install(callback?: Function): Promise<any>;
    getInstallationStatus(callback?: Function): Promise<any>;
    getExcelInstances(callback?: Function): Promise<any>;
    toObject(): any;
}
