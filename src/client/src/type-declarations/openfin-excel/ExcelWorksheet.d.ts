import { RpcDispatcher } from './RpcDispatcher';
import { ExcelWorkbook } from './ExcelWorkbook';
export declare class ExcelWorksheet extends RpcDispatcher {
    workbook: ExcelWorkbook;
    worksheetName: string;
    private objectInstance;
    constructor(name: string, workbook: ExcelWorkbook);
    getDefaultMessage(): any;
    setCells(values: any[][], offset: string): Promise<any>;
    getCells(start: string, offsetWidth: number, offsetHeight: number, callback: Function): Promise<any>;
    getRow(start: string, width: number, callback: Function): Promise<any>;
    getColumn(start: string, offsetHeight: number, callback: Function): Promise<any>;
    activate(): Promise<any>;
    activateCell(cellAddress: string): Promise<any>;
    addButton(name: string, caption: string, cellAddress: string): Promise<any>;
    setFilter(start: string, offsetWidth: number, offsetHeight: number, field: number, criteria1: string, op: string, criteria2: string, visibleDropDown: string): Promise<any>;
    formatRange(rangeCode: string, format: any, callback: Function): Promise<any>;
    clearRange(rangeCode: string, callback: Function): Promise<any>;
    clearRangeContents(rangeCode: string, callback: Function): Promise<any>;
    clearRangeFormats(rangeCode: string, callback: Function): Promise<any>;
    clearAllCells(callback: Function): Promise<any>;
    clearAllCellContents(callback: Function): Promise<any>;
    clearAllCellFormats(callback: Function): Promise<any>;
    setCellName(cellAddress: string, cellName: string): Promise<any>;
    calculate(): Promise<any>;
    getCellByName(cellName: string, callback: Function): Promise<any>;
    protect(password: string): Promise<any>;
    toObject(): any;
}
