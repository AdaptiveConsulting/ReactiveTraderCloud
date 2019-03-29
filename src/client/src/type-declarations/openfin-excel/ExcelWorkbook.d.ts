/*
!!!
These declaration files were obtained from https://github.com/openfin/excel-api-example and amended for better typing
!!!
*/

import { RpcDispatcher } from './RpcDispatcher';
import { ExcelApplication } from './ExcelApplication';
import { ExcelWorksheet } from './ExcelWorksheet';
export declare class ExcelWorkbook extends RpcDispatcher {
    application: ExcelApplication;
    workbookName: string;
    name?: string; // the `toObject` version uses this instead of workbookName!
    worksheets: {
        [worksheetName: string]: ExcelWorksheet;
    };
    private objectInstance;
    constructor(application: ExcelApplication, name: string);
    getDefaultMessage(): any;
    getWorksheets(callback?: Function): Promise<ExcelWorksheet[]>;
    getWorksheetByName(name: string): ExcelWorksheet;
    addWorksheet(callback?: Function): Promise<any>;
    activate(): Promise<any>;
    save(): Promise<any>;
    close(): Promise<any>;
    toObject(): any;
}
