/*
!!!
These declaration files were obtained from https://github.com/openfin/excel-api-example and amended for better typing
!!!
*/

import { RpcDispatcher } from './RpcDispatcher';
import { ExcelWorkbook } from './ExcelWorkbook';
export declare class ExcelApplication extends RpcDispatcher {
    static defaultInstance: ExcelApplication;
    workbooks: {
        [workbookName: string]: ExcelWorkbook;
    };
    connected: boolean;
    initialized: boolean;
    private objectInstance;
    constructor(connectionUuid: string);
    init(): Promise<void>;
    release(): Promise<void>;
    processExcelEvent: (data: any, uuid: string) => void;
    processExcelResult: (result: any) => void;
    subscribeToExcelMessages(): Promise<[void, void]>;
    unsubscribeToExcelMessages(): Promise<[void, void]>;
    monitorDisconnect(): Promise<{}>;
    run(callback?: Function): Promise<void>;
    getWorkbooks(callback?: Function): Promise<ExcelWorkbook[]>;
    getWorkbookByName(name: string): ExcelWorkbook;
    addWorkbook(callback?: Function): Promise<any>;
    openWorkbook(path: string, callback?: Function): Promise<ExcelWorkbook>;
    getConnectionStatus(callback?: Function): Promise<boolean>;
    getCalculationMode(callback: Function): Promise<any>;
    calculateAll(callback: Function): Promise<any>;
    toObject(): any;
}
